import { ScrollView, StyleSheet, Text } from 'react-native';
import { PROJECTS } from '../../features/projects/data';
import { usePlayerStore } from '../../features/player/playerStore';
import { Card } from '../../ui/components/Card';
import { PrimaryButton } from '../../ui/components/PrimaryButton';
import { StatRow } from '../../ui/components/StatRow';

export function ProjectsScreen() {
  const player = usePlayerStore((state) => state.player);
  const startProject = usePlayerStore((state) => state.startProject);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Projects</Text>

      {PROJECTS.map((project) => {
        const canStart = !player.activeProjectId && player.level >= project.requiredLevel;

        return (
          <Card key={project.id}>
            <Text style={styles.name}>{project.name}</Text>
            <StatRow label="Duration" value={`${project.durationSec}s`} />
            <StatRow label="Reward" value={`${project.rewardMoney}`} />
            <StatRow label="Required Level" value={`${project.requiredLevel}`} />
            <PrimaryButton
              label={player.activeProjectId === project.id ? 'Active' : 'Start'}
              onPress={() => startProject(project.id)}
              disabled={!canStart}
            />
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
    marginBottom: 4,
  },
});

