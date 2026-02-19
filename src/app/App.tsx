import { StatusBar } from 'expo-status-bar';
import type { ReactElement } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { AppErrorBoundary } from '../shared/error/AppErrorBoundary';
import { GameScreen } from '../game/ui/screens/GameScreen';

export function AppRoot(): ReactElement {
  return (
    <AppErrorBoundary>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <GameScreen />
          <StatusBar style="light" />
        </View>
      </SafeAreaView>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
});

