import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

type SoundKey = 'tap' | 'purchase' | 'projectComplete';

const SOUND_OPTIONS = {
  playsInSilentModeIOS: false,
  shouldDuckAndroid: true,
  staysActiveInBackground: false,
};

const SOUND_URIS: Record<SoundKey, string> = {
  tap: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg',
  purchase: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
  projectComplete: 'https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg',
};

const sounds: Partial<Record<SoundKey, Audio.Sound>> = {};
let initialized = false;

async function ensureInit(): Promise<void> {
  if (initialized) {
    return;
  }

  try {
    await Audio.setAudioModeAsync(SOUND_OPTIONS);
  } catch {
    // Audio mode failure should not crash app.
  }

  initialized = true;
}

async function loadSound(key: SoundKey): Promise<Audio.Sound | null> {
  await ensureInit();

  if (sounds[key]) {
    return sounds[key] ?? null;
  }

  try {
    const sound = new Audio.Sound();
    const isTap = key === 'tap';

    await sound.loadAsync(
      { uri: SOUND_URIS[key] },
      { shouldPlay: false, volume: isTap ? 0.35 : 0.55 },
      false
    );
    sounds[key] = sound;
    return sound;
  } catch {
    return null;
  }
}

export async function preloadGameFeedback(): Promise<void> {
  await Promise.all([loadSound('tap'), loadSound('purchase'), loadSound('projectComplete')]);
}

export async function playGameSound(key: SoundKey, enabled: boolean): Promise<void> {
  if (!enabled) {
    return;
  }

  const sound = await loadSound(key);
  if (!sound) {
    return;
  }

  try {
    await sound.replayAsync();
  } catch {
    // Ignore playback failures.
  }
}

export async function triggerLightHaptic(enabled: boolean): Promise<void> {
  if (!enabled) {
    return;
  }

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Ignore haptic failures.
  }
}

