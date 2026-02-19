import type { ReactElement } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameState } from '../../application/useGameState';
import { BUILDINGS } from '../../domain/gameTypes';
import { formatCompact } from '../../../shared/utils/numberFormat';
import { BuildingCard } from '../components/BuildingCard';
import { StatCard } from '../components/StatCard';

export function GameScreen(): ReactElement {
  const { state, fps, buildings, onManualCollect, onBuyBuilding, onReset } = useGameState();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Construction Idle</Text>

      <View style={styles.statsRow}>
        <StatCard label="Credits" value={formatCompact(state.credits)} />
        <StatCard label="Output / sec" value={formatCompact(state.productionPerSecond)} />
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Total Produced" value={formatCompact(state.totalProduced)} />
        <StatCard label="Loop FPS" value={`${fps}`} />
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.collectButton} onPress={onManualCollect}>
          <Text style={styles.collectButtonText}>Collect +1</Text>
        </Pressable>
        <Pressable style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {buildings.map((building) => (
          <BuildingCard
            key={building.id}
            buildingId={building.id}
            owned={state.buildings[building.id].owned}
            cost={building.cost}
            canAfford={building.canAfford}
            onBuy={onBuyBuilding}
          />
        ))}
      </ScrollView>

      <Text style={styles.footerText}>
        Assets: {Object.values(BUILDINGS).length} • Tick: 100ms fixed-step
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
    backgroundColor: '#0d1117',
  },
  title: {
    color: '#f0f6fc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  collectButton: {
    flex: 1,
    backgroundColor: '#1f6feb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  collectButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  resetButton: {
    width: 90,
    backgroundColor: '#30363d',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#f0f6fc',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  footerText: {
    color: '#8b949e',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
  },
});

