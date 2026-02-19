import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BUILDINGS, type BuildingId } from '../../domain/gameTypes';
import { formatCompact } from '../../../shared/utils/numberFormat';

type Props = {
  buildingId: BuildingId;
  owned: number;
  cost: number;
  canAfford: boolean;
  onBuy: (id: BuildingId) => void;
};

export function BuildingCard({ buildingId, owned, cost, canAfford, onBuy }: Props): ReactElement {
  const def = BUILDINGS[buildingId];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{def.name}</Text>
        <Text style={styles.owned}>Owned: {owned}</Text>
      </View>
      <Text style={styles.description}>{def.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.production}>+{formatCompact(def.productionPerSecond)}/s each</Text>
        <Pressable
          style={[styles.button, !canAfford && styles.buttonDisabled]}
          disabled={!canAfford}
          onPress={() => onBuy(buildingId)}
        >
          <Text style={styles.buttonText}>Buy ({formatCompact(cost)})</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderColor: '#30363d',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#f0f6fc',
    fontWeight: '700',
    fontSize: 16,
  },
  owned: {
    color: '#8b949e',
    fontSize: 12,
  },
  description: {
    color: '#8b949e',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  production: {
    color: '#7ee787',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#238636',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

