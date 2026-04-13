import { Task, TaskFormData } from '../hooks/useTasks';

const API_BASE_URL = '/api';

export const taskService = {
  // Get all tasks
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