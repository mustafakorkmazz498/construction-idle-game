import { StyleSheet, Text, View } from 'react-native';
import { usePlayerStore } from '../../features/player/playerStore';
import { Card } from '../../ui/components/Card';
import { PrimaryButton } from '../../ui/components/PrimaryButton';
import { StatRow } from '../../ui/components/StatRow';

export function SettingsScreen() {
  const player = usePlayerStore((state) => state.player);
  const setSoundEnabled = usePlayerStore((state) => state.setSoundEnabled);
  const setVibrationEnabled = usePlayerStore((state) => state.setVibrationEnabled);
  const setPhysicsEnabled = usePlayerStore((state) => state.setPhysicsEnabled);
  const resetSave = usePlayerStore((state) => state.resetSave);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Card>
        <StatRow label="Sound" value={player.settings.soundEnabled ? 'On' : 'Off'} />
        <PrimaryButton
          label={player.settings.soundEnabled ? 'Disable Sound' : 'Enable Sound'}
          onPress={() => setSoundEnabled(!player.settings.soundEnabled)}
        />
      </Card>

      <Card>
        <StatRow label="Haptics" value={player.settings.vibrationEnabled ? 'On' : 'Off'} />
        <PrimaryButton
          label={player.settings.vibrationEnabled ? 'Disable Haptics' : 'Enable Haptics'}
          onPress={() => setVibrationEnabled(!player.settings.vibrationEnabled)}
        />
      </Card>

      <Card>
        <StatRow label="Physics" value={player.settings.physicsEnabled ? 'On' : 'Off'} />
        <PrimaryButton
          label={player.settings.physicsEnabled ? 'Disable Physics' : 'Enable Physics'}
          onPress={() => setPhysicsEnabled(!player.settings.physicsEnabled)}
        />
      </Card>

      <Card>
        <StatRow label="Save Data" value="Reset all progress" />
        <PrimaryButton label="Reset Save" onPress={() => void resetSave()} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#0b1220',
  },
  title: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
});

