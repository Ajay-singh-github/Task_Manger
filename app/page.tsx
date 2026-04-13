'use client';

import { useEffect, useState } from 'react';
import { useTasks, Task } from './hooks';
import { Header, TaskTable, AddTaskModal, EditTaskModal } from './components';

export default function Page() {
  const { items, loading, fetchTasks, addTask, updateTask, deleteTask, handleLogout } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Task | null>(null);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (item: Task) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  const handleAddSubmit = async (taskData: any) => {
    return await addTask(taskData);
  };

  const handleEditSubmit = async (id: string, taskData: any) => {
    return await updateTask(id, taskData);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8'>
      <div className='max-w-6xl mx-auto'>
        <Header onAddTask={handleAddClick} onLogout={handleLogout} />

        <TaskTable
          tasks={items}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <AddTaskModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleAddSubmit}
          isLoading={loading}
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
