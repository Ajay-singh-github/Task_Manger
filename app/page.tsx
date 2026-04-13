'use client';

import { useEffect, useState } from 'react';
import { TrashIcon, PencilIcon, PlusIcon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { formatDate } from './lib/customMethod';

interface Item {
  _id: string;
  title: string;
  about: string;
  description: string;
  status: string;
  priority: string;
  updatedAt: Date;
}

export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState({ title: '', about: '', description: '', status: 'pending', priority: 'medium' });

  const handleAddClick = () => {
    setFormData({ title: '', about: '', description: '', status: 'pending', priority: 'medium' });
    setShowAddModal(true);
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setFormData({ title: item.title, about: item.about, description: item.description, status: item.status, priority: item.priority });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            setItems(prev => prev.filter(item => item._id !== id));
          } else {
            console.error('Failed to delete task:', res);
          }
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchTasks();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const updatePayload: Record<string, string> = {
        title: formData.title,
        about: formData.about,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
      };

      const res = await fetch(`/api/tasks/${editingItem._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setItems(prev => prev.map(item => item._id === editingItem._id ? updatedTask : item));
      } else {
        console.log('Failed to update task:', res);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
    setShowEditModal(false);
    setEditingItem(null);
    setFormData({ title: '', about: '', description: '', status: 'pending', priority: 'medium' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
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
  };

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-white mb-2'>Task Manager</h1>
            <p className='text-slate-400'>Manage your tasks efficiently</p>
          </div>
          <div className='flex gap-4'>
            <button
              onClick={handleLogout}
              className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg'
            >
              <ArrowRightOnRectangleIcon className='w-5 h-5 inline mr-2' />
              Logout
            </button>
            <button
              onClick={handleAddClick}
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg'
            >
              <PlusIcon className='w-5 h-5' />
              Add New Task
            </button>
          </div>
        </div>

        {/* Table */}
        <div className='bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-slate-700 border-b border-slate-600'>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Title</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>About</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Description</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Status</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Priority</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Date</th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-white'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items?.length > 0 ? (
                  items?.map((item, index) => (
                    <tr
                      key={item?._id || index}
                      className={`border-b border-slate-700 hover:bg-slate-700 transition ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'
                        }`}
                    >
                      <td className='px-6 py-4 text-sm text-white font-medium'>
                        {item.title}
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-300'>
                        {item.about}
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-300'>
                        {item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description}
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'completed'
                          ? 'bg-green-900 text-green-200'
                          : item.status === 'in-progress'
                            ? 'bg-blue-900 text-blue-200'
                            : 'bg-yellow-900 text-yellow-200'
                          }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.priority === 'high'
                          ? 'bg-red-900 text-red-200'
                          : item.priority === 'medium'
                            ? 'bg-orange-900 text-orange-200'
                            : 'bg-gray-900 text-gray-200'
                          }`}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-300'>
                        {item?.updatedAt ? formatDate(item.updatedAt) : 'N/A'}
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <div className='flex justify-center gap-2'>
                          <button
                            onClick={() => handleEditClick(item)}
                            className='bg-amber-600 hover:bg-amber-700 text-white p-2 rounded transition duration-200'
                            title='Edit'
                          >
                            <PencilIcon className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id)}
                            className='bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-200'
                            title='Delete'
                          >
                            <TrashIcon className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className='px-6 py-8 text-center text-slate-400'>
                      No tasks found. Click "Add New Task" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-slate-700'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-white'>Add New Task</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className='text-slate-400 hover:text-white transition'
                >
                  <XMarkIcon className='w-6 h-6' />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Title</label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter task title'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>About</label>
                  <input
                    type='text'
                    name='about'
                    value={formData.about}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter about'
                  />
                </div>

                <div className='mb-4'>
                  <div className='flex items-center justify-between gap-3 mb-2'>
                    <label className='block text-sm font-medium text-white'>Description</label>
                    <button
                      type='button'
                      onClick={handleGenerateDescription}
                      disabled={generatingDescription || !formData.title || !formData.about}
                      className='text-xs px-3 py-1 border border-slate-600 rounded-lg text-white bg-slate-700 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 transition'
                    >
                      {generatingDescription ? 'Generating...' : 'Generate Description AI'}
                    </button>
                  </div>
                  <input
                    type='text'
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter detailed description'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Status</label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                  >
                    <option value='pending'>Pending</option>
                    <option value='in-progress'>In Progress</option>
                    <option value='completed'>Completed</option>
                  </select>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-white mb-2'>Priority</label>
                  <select
                    name='priority'
                    value={formData.priority}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                  >
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>
                  </select>
                </div>

                <div className='flex gap-3'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                  >
                    {loading ? "Adding..." : "Add Task"}
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowAddModal(false)}
                    className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-slate-700'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-white'>Edit Task</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className='text-slate-400 hover:text-white transition'
                >
                  <XMarkIcon className='w-6 h-6' />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Title</label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter task title'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>About</label>
                  <input
                    type='text'
                    name='about'
                    value={formData.about}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter about'
                  />
                </div>

                <div className='mb-4'>
                  <div className='flex items-center justify-between gap-3 mb-2'>
                    <label className='block text-sm font-medium text-white'>Description</label>
                    <button
                      type='button'
                      onClick={handleGenerateDescription}
                      disabled={generatingDescription || !formData.title || !formData.about}
                      className='text-xs px-3 py-1 border border-slate-600 rounded-lg text-white bg-slate-700 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 transition'
                    >
                      {generatingDescription ? 'Generating...' : 'Generate Description AI'}
                    </button>
                  </div>
                  <input
                    type='text'
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter detailed description'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Status</label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                  >
                    <option value='pending'>Pending</option>
                    <option value='in-progress'>In Progress</option>
                    <option value='completed'>Completed</option>
                  </select>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-white mb-2'>Priority</label>
                  <select
                    name='priority'
                    value={formData.priority}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                  >
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>
                  </select>
                </div>

                <div className='flex gap-3'>
                  <button
                    type='submit'
                    className='flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                  >
                    Update Item
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowEditModal(false)}
                    className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
