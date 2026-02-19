import type { PlayerState } from '../player/playerTypes';
import type { Project } from './projectTypes';

export function getAvailableProjects(player: PlayerState, allProjects: Project[]): Project[] {
  return allProjects.filter((project) => player.level >= project.requiredLevel);
}

export function canStartProject(player: PlayerState, project: Project): boolean {
  return player.level >= project.requiredLevel;
}

