import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(progress, 1));

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${safe * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
});

