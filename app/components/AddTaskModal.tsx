import { useState } from 'react';
import { TaskForm } from './TaskForm';
import { useTaskForm } from '../hooks/useTaskForm';
import { TaskFormData } from '../hooks/useTasks';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<boolean>;
  isLoading: boolean;
}

export const AddTaskModal = ({ isOpen, onClose, onSubmit, isLoading }: AddTaskModalProps) => {
  const {
    formData,
    generatingDescription,
    handleInputChange,
    resetForm,
    handleGenerateDescription,
  } = useTaskForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <TaskForm
      formData={formData}
      generatingDescription={generatingDescription}
      onInputChange={handleInputChange}
      onGenerateDescription={handleGenerateDescription}
      onSubmit={handleSubmit}
      onCancel={handleClose}
      isLoading={isLoading}
      title="Add New Task"
      submitButtonText="Add Task"
      submitButtonColor="bg-blue-600"
    />
  );
};