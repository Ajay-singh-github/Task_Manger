import { XMarkIcon } from '@heroicons/react/24/outline';
import { TaskFormData } from '../hooks/useTasks';

interface TaskFormProps {
  formData: TaskFormData;
  generatingDescription: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onGenerateDescription: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  title: string;
  submitButtonText: string;
  submitButtonColor: string;
}

export const TaskForm = ({
  formData,
  generatingDescription,
  onInputChange,
  onGenerateDescription,
  onSubmit,
  onCancel,
  isLoading,
  title,
  submitButtonText,
  submitButtonColor,
}: TaskFormProps) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-slate-800 rounded-lg shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4 sm:mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold text-white'>{title}</h2>
          <button
            onClick={onCancel}
            className='text-slate-400 hover:text-white transition'
          >
            <XMarkIcon className='w-5 h-5 sm:w-6 sm:h-6' />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-white mb-2'>Title</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={onInputChange}
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
              onChange={onInputChange}
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
                onClick={onGenerateDescription}
                disabled={generatingDescription || !formData.title || !formData.about}
                className='text-xs px-3 py-1 border border-slate-600 rounded-lg text-white bg-slate-700 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 transition'
              >
                {generatingDescription ? 'Generating...' : 'Generate Description AI'}
              </button>
            </div>
            <textarea
              name='description'
              value={formData.description}
              onChange={onInputChange}
              required
              rows={4}
              className='w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none'
              placeholder='Enter detailed description'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-white mb-2'>Status</label>
            <select
              name='status'
              value={formData.status}
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              disabled={isLoading}
              className={`flex-1 ${submitButtonColor} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition duration-200`}
            >
              {isLoading ? "Processing..." : submitButtonText}
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};