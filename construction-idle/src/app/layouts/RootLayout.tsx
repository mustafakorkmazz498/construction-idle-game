import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { usePlayerStore } from '../../features/player/playerStore';

export function RootLayout() {
  const hydrate = usePlayerStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

