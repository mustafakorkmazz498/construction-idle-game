import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { UPGRADES } from '../../features/upgrades/data';
import { usePlayerStore } from '../../features/player/playerStore';
import { getScaledUpgradeCost, getUpgradeOwnedCount } from '../../features/upgrades/upgradeRules';
import { playGameSound, triggerLightHaptic } from '../../shared/feedback/gameFeedback';
import { Card } from '../../ui/components/Card';
import { PrimaryButton } from '../../ui/components/PrimaryButton';
import { StatRow } from '../../ui/components/StatRow';

export function UpgradesScreen() {
  const playerMoney = usePlayerStore((state) => state.player.money);
  const soundEnabled = usePlayerStore((state) => state.player.settings.soundEnabled);
  const vibrationEnabled = usePlayerStore((state) => state.player.settings.vibrationEnabled);
  const ownedUpgrades = usePlayerStore((state) => state.ownedUpgrades);
  const buyUpgrade = usePlayerStore((state) => state.buyUpgrade);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upgrades</Text>

      {UPGRADES.map((upgrade) => {
        const ownedCount = getUpgradeOwnedCount(ownedUpgrades, upgrade.id);
        const owned = !upgrade.isRepeatable && ownedCount > 0;
        const scaledCost = getScaledUpgradeCost(upgrade, ownedCount);
        const canBuy = !owned && playerMoney >= scaledCost;

        return (
          <Card key={upgrade.id}>
            <Text style={styles.name}>{upgrade.name}</Text>
            <Text style={styles.desc}>{upgrade.description}</Text>
            <StatRow label="Effect" value={`${upgrade.effect.type} (+${upgrade.effect.value})`} />
            <StatRow label="Cost" value={scaledCost.toFixed(0)} />
            <StatRow label="Rank" value={upgrade.isRepeatable ? `${ownedCount}` : owned ? 'Owned' : '0'} />
            <View style={styles.buttonWrap}>
              <PrimaryButton
                label={owned ? 'Owned' : upgrade.isRepeatable ? 'Buy (Repeatable)' : 'Buy'}
                onPress={() => {
                  const ok = buyUpgrade(upgrade.id);
                  if (ok) {
                    void playGameSound('purchase', soundEnabled);
                    void triggerLightHaptic(vibrationEnabled);
                  }
                }}
                disabled={!canBuy}
              />
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#0b1220',
  },
  title: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  name: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  desc: {
    color: '#94a3b8',
    fontSize: 13,
  },
  buttonWrap: {
    marginTop: -8,
  },
});

