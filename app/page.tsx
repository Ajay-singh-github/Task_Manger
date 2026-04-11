'use client';

import { useState } from 'react';
import { TrashIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Item {
  id: number;
  name: string;
  email: string;
  status: string;
  date: string;
}

export default function Page() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', date: '2024-01-16' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', date: '2024-01-17' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Active', date: new Date().toISOString().split('T')[0] });

  const handleAddClick = () => {
    setFormData({ name: '', email: '', status: 'Active', date: new Date().toISOString().split('T')[0] });
    setShowAddModal(true);
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setFormData({ name: item.name, email: item.email, status: item.status, date: item.date });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Item = {
      id: Math.max(...items.map(i => i.id), 0) + 1,
      name: formData.name,
      email: formData.email,
      status: formData.status,
      date: formData.date,
    };
    setItems([...items, newItem]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', status: 'Active', date: new Date().toISOString().split('T')[0] });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, name: formData.name, email: formData.email, status: formData.status, date: formData.date }
          : item
      ));
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({ name: '', email: '', status: 'Active', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-white mb-2'>TUDO</h1>
            <p className='text-slate-400'>Manage your items</p>
          </div>
          <button
            onClick={handleAddClick}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg'
          >
            <PlusIcon className='w-5 h-5' />
            Add New
          </button>
        </div>

        {/* Table */}
        <div className='bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-slate-700 border-b border-slate-600'>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Name</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Email</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Status</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Date</th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-white'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-slate-700 hover:bg-slate-700 transition ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'
                        }`}
                    >
                      <td className='px-6 py-4 text-sm text-white font-medium'>{item.name}</td>
                      <td className='px-6 py-4 text-sm text-slate-300'>{item.email}</td>
                      <td className='px-6 py-4 text-sm'>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Active'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-300'>{item.date}</td>
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
                            onClick={() => handleDeleteClick(item.id)}
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
                    <td colSpan={5} className='px-6 py-8 text-center text-slate-400'>
                      No items found. Click "Add New" to create one.
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
                <h2 className='text-2xl font-bold text-white'>Add New Item</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className='text-slate-400 hover:text-white transition'
                >
                  <XMarkIcon className='w-6 h-6' />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter name'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter email'
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
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-white mb-2'>Date</label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                  />
                </div>

                <div className='flex gap-3'>
                  <button
                    type='submit'
                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                  >
                    Add Item
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
                <h2 className='text-2xl font-bold text-white'>Edit Item</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className='text-slate-400 hover:text-white transition'
                >
                  <XMarkIcon className='w-6 h-6' />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter name'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-white mb-2'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                    placeholder='Enter email'
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
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-white mb-2'>Date</label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                  />
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
