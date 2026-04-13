import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface Task {
  _id: string;
  title: string;
  about: string;
  description: string;
  status: string;
  priority: string;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  about: string;
  description: string;
  status: string;
  priority: string;
}

export const useTasks = () => {
  const router = useRouter();
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    if (res.status === 401) {
      router.replace('/login');
      setItems([]);
      return;
    }
    console.log('Fetch tasks response:', res);
    setItems(res.ok ? await res.json() : []);
  };

  const addTask = async (taskData: TaskFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, taskData: TaskFormData) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setItems(prev => prev.map(item => item._id === id ? updatedTask : item));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(item => item._id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  return {
    items,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    handleLogout,
  };
};