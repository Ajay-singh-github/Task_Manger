'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from './hooks';
import { Header, TaskTable, AddTaskModal, EditTaskModal, Pagination, NotificationContainer } from './components';
import { useTasksPaginated } from './hooks/useTasksPaginated';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useNotifications } from './hooks/useNotifications';

export default function Page() {
  const router = useRouter();
  const { notifications, addNotification, removeNotification, success, error } = useNotifications();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Task | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Use appropriate pagination mode based on device
  const {
    tasks,
    pagination,
    isLoading,
    error: queryError,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasksPaginated({
    mode: isMobile ? 'infinite' : 'pagination',
    pageSize: isMobile ? 8 : 10, // Smaller pages for mobile infinite scroll
  });

  const isUnauthorized = queryError instanceof Error && queryError.message === 'Unauthorized';

  useEffect(() => {
    if (isUnauthorized) {
      router.replace('/login');
    }
  }, [isUnauthorized, router]);

  // Infinite scroll for mobile
  useInfiniteScroll({
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    enabled: isMobile,
  });

  if (isUnauthorized) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-slate-900 text-white'>
        <div className='text-center'>
          <p className='text-lg font-semibold'>Redirecting to login…</p>
        </div>
      </div>
    );
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-slate-900 text-white'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500' />
          <p className='mt-4 text-lg font-semibold'>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        success('Logged out successfully', 'You have been logged out of your account');
        setTimeout(() => router.push('/login'), 1000);
      } else {
        error('Logout failed', 'Unable to logout. Please try again.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      error('Logout error', 'An error occurred during logout');
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (item: Task) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        success('Task deleted', 'The task has been successfully deleted');
      } catch (err) {
        console.error('Failed to delete task:', err);
        error('Delete failed', 'Unable to delete the task. Please try again.');
      }
    }
  };

  const handleAddSubmit = async (taskData: any) => {
    try {
      await createTask(taskData);
      success('Task created', 'Your new task has been added successfully');
      return true;
    } catch (err) {
      console.error('Failed to create task:', err);
      error('Creation failed', 'Unable to create the task. Please check your input and try again.');
      return false;
    }
  };

  const handleEditSubmit = async (id: string, taskData: any) => {
    try {
      await updateTask({ id, data: taskData });
      success('Task updated', 'Your task has been updated successfully');
      return true;
    } catch (err) {
      console.error('Failed to update task:', err);
      error('Update failed', 'Unable to update the task. Please try again.');
      return false;
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        <Header onAddTask={handleAddClick} onLogout={handleLogout} />

        <div className="relative">
          <TaskTable
            tasks={tasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />

          {/* Loading indicator for infinite scroll */}
          {isMobile && isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-slate-400">Loading more tasks...</span>
            </div>
          )}

          {/* Pagination for desktop */}
          {!isMobile && pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={goToPage}
            />
          )}
        </div>

        <AddTaskModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleAddSubmit}
          isLoading={isCreating}
        />

        <EditTaskModal
          isOpen={showEditModal}
          task={editingItem}
          onClose={handleCloseEditModal}
          onSubmit={handleEditSubmit}
        />

        {/* Notification Container */}
        <NotificationContainer
          notifications={notifications}
          onRemove={removeNotification}
        />
      </div>
    </div>
  );
}
