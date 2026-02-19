import { StyleSheet, Text, View } from 'react-native';

type StatRowProps = {
  label: string;
  value: string;
};

export function StatRow({ label, value }: StatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
  },
  value: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
});

