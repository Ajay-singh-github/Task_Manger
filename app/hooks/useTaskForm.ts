import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { TaskFormData } from './useTasks';
import { taskService } from '../services/taskService';
import { mutationKeys } from '../services/queryKeys';

export const useTaskForm = (initialData?: Partial<TaskFormData>) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    about: initialData?.about || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
    priority: initialData?.priority || 'medium',
  });

  // Mutation for generating AI description
  const generateDescriptionMutation = useMutation({
    mutationKey: mutationKeys.generateDescription,
    mutationFn: ({ title, about }: { title: string; about: string }) =>
      taskService.generateDescription(title, about),
    onSuccess: (description) => {
      setFormData(prev => ({ ...prev, description }));
    },
    onError: (error) => {
      console.error('AI description generation failed:', error);
      alert('Unable to generate description');
    },
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      about: '',
      description: '',
      status: 'pending',
      priority: 'medium',
    });
  }, []);

  const setFormDataFromTask = useCallback((task: TaskFormData) => {
    setFormData(task);
  }, []);

  const handleSubmit = useCallback(async (onSuccess?: (task: TaskFormData) => void) => {
    if (!formData.title || !formData.about) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const task = await taskService.createTask(formData);
      onSuccess?.(task);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  }, [formData, resetForm]);

  const handleGenerateDescription = useCallback(async () => {
    if (generateDescriptionMutation.isPending) return;
    if (!formData.title || !formData.about) {
      alert('Please enter Title and About first');
      return;
    }

    try {
      await generateDescriptionMutation.mutateAsync({
        title: formData.title,
        about: formData.about,
      });
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Something went wrong generating the description');
    }
  }, [generateDescriptionMutation, formData.title, formData.about]);

  return {
    formData,
    generatingDescription: generateDescriptionMutation.isPending,
    handleInputChange,
    resetForm,
    setFormDataFromTask,
    handleGenerateDescription,
    handleSubmit,
  };
};