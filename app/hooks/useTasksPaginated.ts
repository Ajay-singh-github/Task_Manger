import { useState, useEffect, useCallback } from 'react';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Task, TaskFormData } from './useTasks';
import { taskService, PaginationResponse } from '../services/taskService';
import { queryKeys, mutationKeys } from '../services/queryKeys';

export interface UseTasksPaginatedOptions {
  mode: 'pagination' | 'infinite';
  pageSize?: number;
  enabled?: boolean;
}

export const useTasksPaginated = (options: UseTasksPaginatedOptions = { mode: 'pagination' }) => {
  const { mode, pageSize = 10, enabled = true } = options;
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Pagination query for desktop
  const paginationQuery = useQuery({
    queryKey: queryKeys.tasksPaginated(currentPage, pageSize),
    queryFn: () => taskService.getTasksPaginated(currentPage, pageSize),
    enabled: enabled && mode === 'pagination',
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  // Infinite query for mobile
  const infiniteQuery = useInfiniteQuery({
    queryKey: queryKeys.tasksInfinite(1, pageSize),
    queryFn: ({ pageParam = 1 }) => taskService.getTasksInfinite(pageParam, pageSize),
    initialPageParam: 1,
    enabled: enabled && mode === 'infinite',
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    getNextPageParam: (lastPage: PaginationResponse) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });

  // Determine which query to use based on mode
  const activeQuery = mode === 'pagination' ? paginationQuery : infiniteQuery;

  // Flatten infinite query data
  const tasks = mode === 'infinite'
    ? infiniteQuery.data?.pages.flatMap(page => page.tasks) || []
    : paginationQuery.data?.tasks || [];

  const pagination = mode === 'infinite'
    ? infiniteQuery.data?.pages[infiniteQuery.data.pages.length - 1]?.pagination
    : paginationQuery.data?.pagination;

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'paginated'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'infinite'] });

      // Reset to first page for pagination mode
      if (mode === 'pagination') {
        setCurrentPage(1);
      }
    },
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskFormData }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'paginated'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'infinite'] });
    },
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'paginated'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'infinite'] });
    },
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        router.push('/login');
      }
    },
  });

  // Pagination controls
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination?.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [pagination?.hasPrevPage]);

  // Infinite scroll controls
  const fetchNextPage = useCallback(() => {
    if (mode === 'infinite' && infiniteQuery.hasNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [mode, infiniteQuery]);

  const isFetchingNextPage = infiniteQuery.isFetchingNextPage;

  return {
    // Data
    tasks,
    pagination,

    // Loading states
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,

    // Pagination controls (desktop)
    currentPage,
    goToPage,
    nextPage,
    prevPage,

    // Infinite scroll controls (mobile)
    fetchNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    isFetchingNextPage,

    // Mutations
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};