export const queryKeys = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
} as const;

export const mutationKeys = {
  createTask: ['createTask'] as const,
  updateTask: (id: string) => ['updateTask', id] as const,
  deleteTask: (id: string) => ['deleteTask', id] as const,
  generateDescription: ['generateDescription'] as const,
} as const;