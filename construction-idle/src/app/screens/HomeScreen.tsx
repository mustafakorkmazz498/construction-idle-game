import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { computeIncomePerSecond } from '../../features/economy/economyCalculations';
import { usePlayerStore } from '../../features/player/playerStore';
import { PROJECTS } from '../../features/projects/data';
import { createFixedTimestepLoop } from '../../game/loop/fixedTimestepLoop';
import { playGameSound, preloadGameFeedback, triggerLightHaptic } from '../../shared/feedback/gameFeedback';
import { Card } from '../../ui/components/Card';
import { PrimaryButton } from '../../ui/components/PrimaryButton';
import { ProgressBar } from '../../ui/components/ProgressBar';
import { StatRow } from '../../ui/components/StatRow';

export function HomeScreen() {
  const router = useRouter();

  const player = usePlayerStore((state) => state.player);
  const ownedUpgrades = usePlayerStore((state) => state.ownedUpgrades);
  const tick = usePlayerStore((state) => state.tick);
  const finishProject = usePlayerStore((state) => state.finishProject);
  const startProject = usePlayerStore((state) => state.startProject);
  const addTapMoney = usePlayerStore((state) => state.addTapMoney);
  const collectCompletedProjectReward = usePlayerStore((state) => state.collectCompletedProjectReward);
  const [updatesPerSecond, setUpdatesPerSecond] = useState(0);
  const updatesCounterRef = useRef(0);
  const hudTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const incomePerSec = useMemo(() => computeIncomePerSecond(player, ownedUpgrades), [player, ownedUpgrades]);
  const activeProject = PROJECTS.find((project) => project.id === player.activeProjectId) ?? null;
  const pendingRewardProject = PROJECTS.find((project) => project.id === player.pendingProjectRewardId) ?? null;
  const firstAvailableProject = PROJECTS.find((project) => project.requiredLevel <= player.level) ?? null;
  const progressToNextLevel = Math.max(0, Math.min((player.money % 1000) / 1000, 1));

  useEffect(() => {
    void preloadGameFeedback();
  }, []);

  useEffect(() => {
    const loop = createFixedTimestepLoop({
      targetUpdatesPerSecond: 60,
      maxDeltaSec: 0.25,
      onTick: (dtSec) => {
        tick(dtSec);
        updatesCounterRef.current += 1;
      },
    });

    loop.start();
    hudTimerRef.current = setInterval(() => {
      setUpdatesPerSecond(updatesCounterRef.current);
      updatesCounterRef.current = 0;
    }, 1000);

    return () => {
      loop.stop();
      if (hudTimerRef.current) {
        clearInterval(hudTimerRef.current);
        hudTimerRef.current = null;
      }
    };
  }, [tick]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Construction Idle</Text>

      <Card>
        <StatRow label="Money" value={player.money.toFixed(2)} />
        <StatRow label="Income / sec" value={incomePerSec.toFixed(2)} />
        <StatRow label="Level" value={`${player.level}`} />
        <StatRow label="Updates / sec" value={`${updatesPerSecond}`} />
        <StatRow label="Active Project" value={activeProject?.name ?? 'None'} />
        <StatRow label="Project Ends At" value={player.projectEndAt ?? '-'} />
      </Card>

      {pendingRewardProject && (
        <Card>
          <Text style={styles.bannerTitle}>Project completed! Collect reward</Text>
          <StatRow label="Project" value={pendingRewardProject.name} />
          <StatRow label="Reward" value={`${pendingRewardProject.rewardMoney}`} />
          <PrimaryButton
            label="Collect"
            onPress={() => {
              const ok = collectCompletedProjectReward();
              if (ok) {
                void playGameSound('projectComplete', player.settings.soundEnabled);
              }
            }}
          />
        </Card>
      )}

      <Card>
        <Text style={styles.sectionTitle}>Progress to next level</Text>
        <ProgressBar progress={progressToNextLevel} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Main Actions</Text>
        <PrimaryButton
          label="Tap +Money"
          onPress={() => {
            addTapMoney();
            void playGameSound('tap', player.settings.soundEnabled);
            void triggerLightHaptic(player.settings.vibrationEnabled);
          }}
        />
        <PrimaryButton
          label={activeProject ? 'Finish Active Project' : 'No Active Project'}
          onPress={() => finishProject()}
          disabled={!activeProject}
        />
        <PrimaryButton
          label={activeProject ? 'Project Running' : 'Start First Available Project'}
          onPress={() => {
            if (firstAvailableProject) {
              startProject(firstAvailableProject.id);
            }
          }}
          disabled={Boolean(activeProject) || !firstAvailableProject}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Navigate</Text>
        <PrimaryButton label="Upgrades" onPress={() => router.push('/upgrades')} />
        <PrimaryButton label="Projects" onPress={() => router.push('/projects')} />
        <PrimaryButton label="Settings" onPress={() => router.push('/settings')} />
      </Card>

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0b1220',
    padding: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '700',
  },
  bannerTitle: {
    color: '#86efac',
    fontSize: 16,
    fontWeight: '800',
  },
});

