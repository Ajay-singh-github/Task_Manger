import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onAddTask: () => void;
  onLogout: () => void;
}

export const Header = ({ onAddTask, onLogout }: HeaderProps) => {
  return (
    <div className='flex justify-between items-center mb-8'>
      <div>
        <h1 className='text-4xl font-bold text-white mb-2'>Task Manager</h1>
        <p className='text-slate-400'>Manage your tasks efficiently</p>
      </div>
      <div className='flex gap-4'>
        <button
          onClick={onLogout}
          className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg'
        >
          <ArrowRightOnRectangleIcon className='w-5 h-5 inline mr-2' />
          Logout
        </button>
        <button
          onClick={onAddTask}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg'
        >
          <PlusIcon className='w-5 h-5' />
          Add New Task
        </button>
      </div>
    </div>
  );
};