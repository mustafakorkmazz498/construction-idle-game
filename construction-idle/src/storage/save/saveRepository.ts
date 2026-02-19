import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SaveGameData } from './schema';

const SAVE_KEY = 'construction-idle/savegame';

export async function saveGame(data: SaveGameData): Promise<void> {
  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export async function loadGame(): Promise<SaveGameData | null> {
  const raw = await AsyncStorage.getItem(SAVE_KEY);
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as SaveGameData;
}

export async function clearGame(): Promise<void> {
  await AsyncStorage.removeItem(SAVE_KEY);
}

