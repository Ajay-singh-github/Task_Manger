import { Task, TaskFormData } from '../hooks/useTasks';
import { TaskRow } from './TaskRow';
import { TaskCard } from './TaskCard';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskTable = ({ tasks, onEdit, onDelete }: TaskTableProps) => {
  return (
    <div className='bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700'>
      {/* Desktop Table View */}
      <div className='hidden md:block'>
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
              {tasks?.length > 0 ? (
                tasks?.map((task, index) => (
                  <TaskRow
                    key={task?._id || index}
                    task={task}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
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

      {/* Mobile Card View */}
      <div className='md:hidden'>
        <div className='p-4'>
          {tasks?.length > 0 ? (
            tasks?.map((task, index) => (
              <TaskCard
                key={task?._id || index}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className='text-center py-8 text-slate-400'>
              No tasks found. Click "Add New Task" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};