import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onAddTask: () => void;
  onLogout: () => void;
}

export const Header = ({ onAddTask, onLogout }: HeaderProps) => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4'>
      <div>
        <h1 className='text-2xl sm:text-4xl font-bold text-white mb-2'>Task Manager</h1>
        <p className='text-slate-400 text-sm sm:text-base'>Manage your tasks efficiently</p>
      </div>
      <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto'>
        <button
          onClick={onLogout}
          className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 shadow-lg text-sm sm:text-base'
        >
          <ArrowRightOnRectangleIcon className='w-4 h-4 sm:w-5 sm:h-5 inline mr-2' />
          Logout
        </button>
        <button
          onClick={onAddTask}
          className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 shadow-lg text-sm sm:text-base'
        >
          <PlusIcon className='w-4 h-4 sm:w-5 sm:h-5' />
          Add New Task
        </button>
      </div>
    </div>
  );
};