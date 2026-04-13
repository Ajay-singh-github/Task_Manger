import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { taskService } from '../services/taskService';
import { queryKeys, mutationKeys } from '../services/queryKeys';

export interface Task {
  _id: string;
  title: string;
  about: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
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
  const queryClient = useQueryClient();

  // Query for fetching tasks
  const {
    data: items = [],
    isLoading: loading,
    error,
    refetch: fetchTasks,
  } = useQuery({
    queryKey: queryKeys.tasks,
    queryFn: taskService.getTasks,
  });

  // Mutation for creating tasks
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    },
  });

  // Mutation for updating tasks
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    },
  });

  // Mutation for deleting tasks
  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    },
  });

  // Mutation for logout
  const logoutMutation = useMutation({
    mutationFn: taskService.logout,
    onSuccess: () => {
      router.replace('/login');
    },
  });

  const addTask = async (taskData: TaskFormData) => {
    try {
      await createTaskMutation.mutateAsync(taskData);
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      return false;
    }
  };

  const updateTask = async (id: string, taskData: TaskFormData) => {
    try {
      await updateTaskMutation.mutateAsync({ id, data: taskData });
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Error logging out:', error);
      // Still redirect even if logout fails
      router.replace('/login');
    }
  };

  return {
    items,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    handleLogout,
    // Expose mutation states for loading indicators
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};