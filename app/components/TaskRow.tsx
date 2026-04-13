import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../lib/customMethod';
import { Task } from '../hooks/useTasks';

interface TaskRowProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskRow = ({ task, index, onEdit, onDelete }: TaskRowProps) => {
  return (
    <tr
      className={`border-b border-slate-700 hover:bg-slate-700 transition ${
        index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'
      }`}
    >
      <td className='px-6 py-4 text-sm text-white font-medium'>
        {task.title}
      </td>
      <td className='px-6 py-4 text-sm text-slate-300'>
        {task.about}
      </td>
      <td className='px-6 py-4 text-sm text-slate-300'>
        {task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description}
      </td>
      <td className='px-6 py-4 text-sm'>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          task.status === 'completed'
            ? 'bg-green-900 text-green-200'
            : task.status === 'in-progress'
              ? 'bg-blue-900 text-blue-200'
              : 'bg-yellow-900 text-yellow-200'
        }`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
        </span>
      </td>
      <td className='px-6 py-4 text-sm'>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          task.priority === 'high'
            ? 'bg-red-900 text-red-200'
            : task.priority === 'medium'
              ? 'bg-orange-900 text-orange-200'
              : 'bg-gray-900 text-gray-200'
        }`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-slate-300'>
        {task?.updatedAt ? formatDate(task.updatedAt) : 'N/A'}
      </td>
      <td className='px-6 py-4 text-center'>
        <div className='flex justify-center gap-2'>
          <button
            onClick={() => onEdit(task)}
            className='bg-amber-600 hover:bg-amber-700 text-white p-2 rounded transition duration-200'
            title='Edit'
          >
            <PencilIcon className='w-4 h-4' />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className='bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-200'
            title='Delete'
          >
            <TrashIcon className='w-4 h-4' />
          </button>
        </div>
      </td>
    </tr>
  );
};