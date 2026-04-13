import { Task, TaskFormData } from '../hooks/useTasks';

const API_BASE_URL = '/api';

export interface PaginationResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export const taskService = {
  // Get all tasks (legacy method for backward compatibility)
  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return res.json();
  },

  // Get paginated tasks
  async getTasksPaginated(page: number = 1, limit: number = 10): Promise<PaginationResponse> {
    const res = await fetch(`${API_BASE_URL}/tasks?page=${page}&limit=${limit}`);
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return res.json();
  },

  // Get tasks for infinite scroll (append mode)
  async getTasksInfinite(page: number = 1, limit: number = 10): Promise<PaginationResponse> {
    return this.getTasksPaginated(page, limit);
  },

  // Create a new task
  async createTask(taskData: TaskFormData): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      throw new Error('Failed to create task');
    }

    return res.json();
  },

  // Update a task
  async updateTask(id: string, taskData: TaskFormData): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      throw new Error('Failed to update task');
    }

    return res.json();
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete task');
    }
  },

  // Generate AI description
  async generateDescription(title: string, about: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, about }),
    });

    if (!res.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await res.json();
    return data.description;
  },

  // Logout
  async logout(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Failed to logout');
    }
  },
};