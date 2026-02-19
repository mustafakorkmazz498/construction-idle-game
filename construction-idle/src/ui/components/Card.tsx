import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 10,
  },
});

