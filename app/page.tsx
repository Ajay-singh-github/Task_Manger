'use client';

import { useEffect, useState } from 'react';
import { TrashIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Item {
  _id: string;
  name: string;
  email: string;
  status: string;
  password?: string;
}

export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Active', password: '' });

  const handleAddClick = () => {
    setFormData({ name: '', email: '', status: 'Active', password: '' });
    setShowAddModal(true);
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setFormData({ name: item.name, email: item.email, status: item.status, password: '' });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      fetch(`/api/users/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            setItems(prev => prev.filter(item => item._id !== id));
          } else {
            console.error('Failed to delete user:', res);
          }
        })
        .catch(error => console.error('Error deleting item:', error));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent double call
    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchUsers()
        // setItems(prev => [...prev, data]);
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
        name: formData.name,
        email: formData.email,
        status: formData.status,
      };

      if (formData.password.trim()) {
        updatePayload.password = formData.password;
      }

      const res = await fetch(`/api/users/${editingItem._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setItems(prev => prev.map(item => item._id === editingItem._id ? updatedUser : item));
      } else {
        console.log('Failed to update user:', res);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
    setShowEditModal(false);
    setEditingItem(null);
    setFormData({ name: '', email: '', status: 'Active', password: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if(res.status === 401) {
      router.replace('/login');
    }
    console.log('Fetch users response:', res);
    setItems(res.ok ? await res.json() : []);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
                  <th className='px-6 py-4 text-left text-sm font-semibold text-white'>Password</th>
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
                        {item.name}
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-300'>
                        {item.email}
                      </td>
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
                      <td className='px-6 py-4 text-sm text-slate-300'>
                        **********
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
                  <label className='block text-sm font-medium text-white mb-2'>Password</label>
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition'
                  />
                </div>

                <div className='flex gap-3'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
                  >
                    {loading ? "Adding..." : "Add Item"}
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
                    <option value='active'>Active</option>
                    <option value='inactive'>Inactive</option>
                  </select>
                </div>

                <div className='mb-6'>
                  <label className='block text-sm font-medium text-white mb-2'>Password</label>
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
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
