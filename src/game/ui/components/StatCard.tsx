import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: Props): ReactElement {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  label: {
    fontSize: 12,
    color: '#8b949e',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#f0f6fc',
    fontWeight: '700',
  },
});

