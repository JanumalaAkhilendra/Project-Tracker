import { useState } from 'react';
import { format } from 'date-fns';
import { useProject } from '../context/ProjectContext';
import Avatar from './Avatar';
import Button from './Button';
import TaskModal from './TaskModal';
import CommentSection from './CommentSection';

const statusColors = {
  todo: 'bg-gray-200',
  'in-progress': 'bg-blue-200',
  done: 'bg-green-200',
};

const TaskCard = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { updateTask, deleteTask, members } = useProject();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task._id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg shadow mb-4 cursor-pointer ${statusColors[task.status]}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <span className="text-sm capitalize px-2 py-1 rounded bg-white">
            {task.status.replace('-', ' ')}
          </span>
        </div>
        
        {task.description && (
          <p className="mt-2 text-gray-600 line-clamp-2">{task.description}</p>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {task.assignee && (
              <Avatar user={task.assignee} size="sm" />
            )}
            {task.dueDate && (
              <span className="text-sm text-gray-500">
                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        task={task}
        members={members}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </>
  );
};

export default TaskCard;