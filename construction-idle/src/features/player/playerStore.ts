import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { BalanceConfig } from '../balance/BalanceConfig';
import { computeIncomePerSecond, computeOfflineProgress, computeTapBonus } from '../economy/economyCalculations';
import { PROJECTS } from '../projects/data';
import { canStartProject } from '../projects/projectRules';
import { INITIAL_PLAYER_STATE } from './data';
import type { PlayerState } from './playerTypes';
import { UPGRADES } from '../upgrades/data';
import type { Upgrade } from '../upgrades/upgradeTypes';
import { getScaledUpgradeCost, purchaseUpgrade } from '../upgrades/upgradeRules';

const PLAYER_STORE_KEY = 'construction-idle/player-store-v1';
const PERSIST_DEBOUNCE_MS = 500;

type PersistedPlayerStore = {
  player: PlayerState;
  ownedUpgradeIds: string[];
};

type PlayerStoreState = {
  player: PlayerState;
  ownedUpgrades: Upgrade[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  tick: (dtSec: number) => void;
  applyOfflineProgress: (now: string | Date) => void;
  buyUpgrade: (upgradeId: string) => boolean;
  startProject: (projectId: string) => boolean;
  finishProject: () => boolean;
  addTapMoney: () => number;
  setPhysicsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  resetSave: () => Promise<void>;
  collectCompletedProjectReward: () => boolean;
};

let persistTimer: ReturnType<typeof setTimeout> | null = null;
const tapHistoryMs: number[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parsePersistedStore(raw: string | null): PersistedPlayerStore | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      return null;
    }

    const player = parsed.player;
    const ownedUpgradeIds = parsed.ownedUpgradeIds;

    if (!isRecord(player) || !Array.isArray(ownedUpgradeIds)) {
      return null;
    }

    const candidate = player as Partial<PlayerState>;
    if (
      typeof candidate.money !== 'number' ||
      typeof candidate.level !== 'number' ||
      typeof candidate.workers !== 'number' ||
      typeof candidate.equipment !== 'number' ||
      (candidate.activeProjectId !== null && typeof candidate.activeProjectId !== 'string') ||
      (candidate.projectEndAt !== null && typeof candidate.projectEndAt !== 'string') ||
      (candidate.pendingProjectRewardId !== null && typeof candidate.pendingProjectRewardId !== 'string') ||
      typeof candidate.lastTickAt !== 'string' ||
      !isRecord(candidate.settings)
    ) {
      return null;
    }

    return {
      player: {
        money: candidate.money,
        level: candidate.level,
        workers: candidate.workers,
        equipment: candidate.equipment,
        activeProjectId: candidate.activeProjectId ?? null,
        projectEndAt: candidate.projectEndAt ?? null,
        pendingProjectRewardId: candidate.pendingProjectRewardId ?? null,
        lastTickAt: candidate.lastTickAt,
        settings: {
          soundEnabled: Boolean(candidate.settings.soundEnabled),
          vibrationEnabled: Boolean(candidate.settings.vibrationEnabled),
          physicsEnabled:
            typeof candidate.settings.physicsEnabled === 'boolean'
              ? candidate.settings.physicsEnabled
              : true,
          graphicsQuality:
            candidate.settings.graphicsQuality === 'low' ||
            candidate.settings.graphicsQuality === 'medium' ||
            candidate.settings.graphicsQuality === 'high'
              ? candidate.settings.graphicsQuality
              : 'high',
        },
      },
      ownedUpgradeIds: ownedUpgradeIds.filter((id): id is string => typeof id === 'string'),
    };
  } catch {
    return null;
  }
}

function queuePersist(save: () => Promise<void>): void {
  if (persistTimer) {
    clearTimeout(persistTimer);
  }

  persistTimer = setTimeout(() => {
    void save();
  }, PERSIST_DEBOUNCE_MS);
}

export const usePlayerStore = create<PlayerStoreState>((set, get) => ({
  player: {
    ...INITIAL_PLAYER_STATE,
    lastTickAt: new Date().toISOString(),
  },
  ownedUpgrades: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(PLAYER_STORE_KEY);
      const parsed = parsePersistedStore(raw);

      if (!parsed) {
        set({ isHydrated: true });
        return;
      }

      const ownedUpgrades = UPGRADES.filter((upgrade) => parsed.ownedUpgradeIds.includes(upgrade.id));

      set({
        player: parsed.player,
        ownedUpgrades,
        isHydrated: true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },

  persist: async () => {
    const { player, ownedUpgrades } = get();
    const payload: PersistedPlayerStore = {
      player,
      ownedUpgradeIds: ownedUpgrades.map((upgrade) => upgrade.id),
    };

    try {
      await AsyncStorage.setItem(PLAYER_STORE_KEY, JSON.stringify(payload));
    } catch {
      // Swallow storage errors to keep app stable.
    }
  },

  tick: (dtSec) => {
    if (!Number.isFinite(dtSec) || dtSec <= 0) {
      return;
    }

    const { player, ownedUpgrades, persist } = get();
    const incomePerSec = computeIncomePerSecond(player, ownedUpgrades);
    let nextPlayer: PlayerState = {
      ...player,
      money: player.money + incomePerSec * dtSec,
      lastTickAt: new Date().toISOString(),
    };

    if (
      nextPlayer.activeProjectId &&
      nextPlayer.projectEndAt &&
      !nextPlayer.pendingProjectRewardId
    ) {
      const endMs = Date.parse(nextPlayer.projectEndAt);
      if (Number.isFinite(endMs) && Date.now() >= endMs) {
        nextPlayer = {
          ...nextPlayer,
          pendingProjectRewardId: nextPlayer.activeProjectId,
          activeProjectId: null,
          projectEndAt: null,
        };
      }
    }

    set({ player: nextPlayer });
    queuePersist(persist);
  },

  applyOfflineProgress: (now) => {
    const nowIso = typeof now === 'string' ? now : now.toISOString();
    const { player, ownedUpgrades, persist } = get();
    const result = computeOfflineProgress(player, ownedUpgrades, nowIso);

    set({ player: result.nextPlayerState });
    queuePersist(persist);
  },

  buyUpgrade: (upgradeId) => {
    const { player, ownedUpgrades, persist } = get();
    const targetUpgrade = UPGRADES.find((upgrade) => upgrade.id === upgradeId);

    if (!targetUpgrade) {
      return false;
    }

    const ownedCount = ownedUpgrades.filter((entry) => entry.id === targetUpgrade.id).length;
    const scaledCost = getScaledUpgradeCost(targetUpgrade, ownedCount);
    if (player.money < scaledCost) {
      return false;
    }

    const result = purchaseUpgrade(player, ownedUpgrades, targetUpgrade);
    if (!result.purchased) {
      return false;
    }

    set({
      player: {
        ...result.player,
        lastTickAt: new Date().toISOString(),
      },
      ownedUpgrades: result.ownedUpgrades,
    });
    queuePersist(persist);
    return true;
  },

  startProject: (projectId) => {
    const { player, persist } = get();
    if (player.activeProjectId) {
      return false;
    }

    const project = PROJECTS.find((entry) => entry.id === projectId);
    if (!project || !canStartProject(player, project)) {
      return false;
    }

    const endAt = new Date(Date.now() + project.durationSec * 1000).toISOString();

    set({
      player: {
        ...player,
        activeProjectId: project.id,
        projectEndAt: endAt,
        pendingProjectRewardId: null,
        lastTickAt: new Date().toISOString(),
      },
    });
    queuePersist(persist);
    return true;
  },

  finishProject: () => {
    const { player, persist } = get();
    if (!player.activeProjectId) {
      return false;
    }

    const project = PROJECTS.find((entry) => entry.id === player.activeProjectId);
    if (!project) {
      set({
        player: {
          ...player,
          activeProjectId: null,
          projectEndAt: null,
          pendingProjectRewardId: null,
          lastTickAt: new Date().toISOString(),
        },
      });
      queuePersist(persist);
      return false;
    }

    const shouldLevelUp = player.level < 99 && project.requiredLevel >= player.level;

    set({
      player: {
        ...player,
        money: player.money + project.rewardMoney,
        level: shouldLevelUp ? player.level + 1 : player.level,
        activeProjectId: null,
        projectEndAt: null,
        pendingProjectRewardId: null,
        lastTickAt: new Date().toISOString(),
      },
    });
    queuePersist(persist);
    return true;
  },

  addTapMoney: () => {
    const { player, ownedUpgrades, persist } = get();
    const tapBonus = computeTapBonus(ownedUpgrades);
    const nowMs = Date.now();
    const windowStart = nowMs - BalanceConfig.tap.windowMs;

    while (tapHistoryMs.length > 0 && tapHistoryMs[0] < windowStart) {
      tapHistoryMs.shift();
    }

    const projectedCount = tapHistoryMs.length + 1;
    let multiplier = 1;
    if (projectedCount > BalanceConfig.tap.softCapPerMinute) {
      const extraTaps = projectedCount - BalanceConfig.tap.softCapPerMinute;
      multiplier = Math.max(
        BalanceConfig.tap.minMultiplier,
        1 - extraTaps * BalanceConfig.tap.decayPerExtraTap
      );
    }

    tapHistoryMs.push(nowMs);

    const amount = Math.max(1, tapBonus * multiplier);

    set({
      player: {
        ...player,
        money: player.money + amount,
        lastTickAt: new Date().toISOString(),
      },
    });
    queuePersist(persist);
    return amount;
  },

  setPhysicsEnabled: (enabled) => {
    const { player, persist } = get();

    set({
      player: {
        ...player,
        settings: {
          ...player.settings,
          physicsEnabled: enabled,
        },
      },
    });
    queuePersist(persist);
  },

  setSoundEnabled: (enabled) => {
    const { player, persist } = get();

    set({
      player: {
        ...player,
        settings: {
          ...player.settings,
          soundEnabled: enabled,
        },
      },
    });
    queuePersist(persist);
  },

  setVibrationEnabled: (enabled) => {
    const { player, persist } = get();

    set({
      player: {
        ...player,
        settings: {
          ...player.settings,
          vibrationEnabled: enabled,
        },
      },
    });
    queuePersist(persist);
  },

  resetSave: async () => {
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }

    try {
      await AsyncStorage.removeItem(PLAYER_STORE_KEY);
    } catch {
      // Keep app stable even if clear fails.
    }

    set({
      player: {
        ...INITIAL_PLAYER_STATE,
        lastTickAt: new Date().toISOString(),
      },
      ownedUpgrades: [],
      isHydrated: true,
    });
  },

  collectCompletedProjectReward: () => {
    const { player, persist } = get();
    if (!player.pendingProjectRewardId) {
      return false;
    }

    const project = PROJECTS.find((entry) => entry.id === player.pendingProjectRewardId);
    if (!project) {
      set({
        player: {
          ...player,
          pendingProjectRewardId: null,
          lastTickAt: new Date().toISOString(),
        },
      });
      queuePersist(persist);
      return false;
    }

    const shouldLevelUp = player.level < 99 && project.requiredLevel >= player.level;
    set({
      player: {
        ...player,
        money: player.money + project.rewardMoney,
        level: shouldLevelUp ? player.level + 1 : player.level,
        pendingProjectRewardId: null,
        lastTickAt: new Date().toISOString(),
      },
    });
    queuePersist(persist);
    return true;
  },
}));

