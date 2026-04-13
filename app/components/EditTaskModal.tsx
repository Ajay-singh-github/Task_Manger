import { useEffect } from 'react';
import { TaskForm } from './TaskForm';
import { useTaskForm } from '../hooks/useTaskForm';
import { Task, TaskFormData } from '../hooks/useTasks';

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (id: string, taskData: TaskFormData) => Promise<boolean>;
}

export const EditTaskModal = ({ isOpen, task, onClose, onSubmit }: EditTaskModalProps) => {
  const {
    formData,
    generatingDescription,
    handleInputChange,
    setFormDataFromTask,
    handleGenerateDescription,
  } = useTaskForm();

  useEffect(() => {
    if (task && isOpen) {
      setFormDataFromTask({
        title: task.title,
        about: task.about,
        description: task.description,
        status: task.status,
        priority: task.priority,
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    const success = await onSubmit(task._id, formData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <TaskForm
      formData={formData}
      generatingDescription={generatingDescription}
      onInputChange={handleInputChange}
      onGenerateDescription={handleGenerateDescription}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isLoading={false}
      title="Edit Task"
      submitButtonText="Update Task"
      submitButtonColor="bg-amber-600"
    />
  );
};