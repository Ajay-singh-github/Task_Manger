export const queryKeys = {
  tasks: ['tasks'] as const,
  tasksPaginated: (page: number, limit: number) => ['tasks', 'paginated', page, limit] as const,
  tasksInfinite: (page: number, limit: number) => ['tasks', 'infinite', page, limit] as const,
  task: (id: string) => ['tasks', id] as const,
} as const;

export const mutationKeys = {
  createTask: ['createTask'] as const,
  updateTask: (id: string) => ['updateTask', id] as const,
  deleteTask: (id: string) => ['deleteTask', id] as const,
  generateDescription: ['generateDescription'] as const,
} as const;