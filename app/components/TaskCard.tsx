import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../lib/customMethod';
import { Task } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <div className='bg-slate-750 rounded-lg p-4 mb-4 border border-slate-600'>
      <div className='flex justify-between items-start mb-3'>
        <h3 className='text-lg font-semibold text-white flex-1 mr-2'>{task.title}</h3>
        <div className='flex gap-2'>
          <button
            onClick={() => onEdit(task)}
            className='p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-600 rounded-lg transition'
            title='Edit task'
          >
            <PencilIcon className='w-5 h-5' />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className='p-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded-lg transition'
            title='Delete task'
          >
            <TrashIcon className='w-5 h-5' />
          </button>
        </div>
      </div>

      <div className='space-y-2 mb-3'>
        <div>
          <span className='text-sm font-medium text-slate-300'>About: </span>
          <span className='text-sm text-slate-400'>{task.about}</span>
        </div>
        <div>
          <span className='text-sm font-medium text-slate-300'>Description: </span>
          <span className='text-sm text-slate-400'>
            {task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description}
          </span>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 mb-3'>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          task.status === 'completed'
            ? 'bg-green-900 text-green-200'
            : task.status === 'in-progress'
              ? 'bg-blue-900 text-blue-200'
              : 'bg-yellow-900 text-yellow-200'
        }`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          task.priority === 'high'
            ? 'bg-red-900 text-red-200'
            : task.priority === 'medium'
              ? 'bg-orange-900 text-orange-200'
              : 'bg-gray-900 text-gray-200'
        }`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className='text-xs text-slate-500'>
        Created: {formatDate(task.createdAt)}
      </div>
    </div>
  );
};