import type { SaveGameData } from '../save/schema';

export function validateLoadedSave(data: unknown): SaveGameData | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const candidate = data as Partial<SaveGameData>;
  if (
    typeof candidate.version !== 'number' ||
    typeof candidate.updatedAt !== 'string' ||
    typeof candidate.payload !== 'object' ||
    candidate.payload === null
  ) {
    return null;
  }

  return {
    version: candidate.version,
    updatedAt: candidate.updatedAt,
    payload: candidate.payload as Record<string, unknown>,
  };
}

