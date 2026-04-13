'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from './hooks';
import { Header, TaskTable, AddTaskModal, EditTaskModal, Pagination } from './components';
import { useTasksPaginated } from './hooks/useTasksPaginated';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

export default function Page() {
  const router = useRouter();
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

  // Infinite scroll for mobile
  useInfiniteScroll({
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    enabled: isMobile,
  });

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error during logout');
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
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleAddSubmit = async (taskData: any) => {
    try {
      await createTask(taskData);
      return true;
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
      return false;
    }
  };

  const handleEditSubmit = async (id: string, taskData: any) => {
    try {
      await updateTask({ id, data: taskData });
      return true;
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task');
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
      </div>
    </div>
  );
}
