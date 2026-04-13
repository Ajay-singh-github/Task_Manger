import { useState, useCallback } from 'react';
import { TaskFormData } from './useTasks';

export const useTaskForm = (initialData?: Partial<TaskFormData>) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    about: initialData?.about || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
    priority: initialData?.priority || 'medium',
  });

  const [generatingDescription, setGeneratingDescription] = useState(false);

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

  const handleGenerateDescription = useCallback(async () => {
    if (generatingDescription) return;
    if (!formData.title || !formData.about) {
      alert('Please enter Title and About first');
      return;
    }

    setGeneratingDescription(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, about: formData.about }),
      });

      console.log('AI generation response:', res);
      const data = await res.json();
      if (res.ok && data.description) {
        setFormData(prev => ({ ...prev, description: data.description }));
      } else {
        console.error('AI description generation failed:', data);
        alert(data.error || 'Unable to generate description');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Something went wrong generating the description');
    } finally {
      setGeneratingDescription(false);
    }
  }, [generatingDescription, formData.title, formData.about]);

  return {
    formData,
    generatingDescription,
    handleInputChange,
    resetForm,
    setFormDataFromTask,
    handleGenerateDescription,
  };
};