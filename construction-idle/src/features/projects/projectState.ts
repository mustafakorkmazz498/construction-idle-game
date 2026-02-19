export type ProjectState = {
  active: string[];
  completed: string[];
};

export const DEFAULT_PROJECT_STATE: ProjectState = {
  active: ['starter-site'],
  completed: [],
};

