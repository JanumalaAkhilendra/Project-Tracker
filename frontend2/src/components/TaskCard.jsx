// src/components/TaskCard.jsx
import { FiUser, FiFlag, FiCalendar } from 'react-icons/fi';

const statusColors = {
  todo: 'bg-gray-200 text-gray-800',
  'in-progress': 'bg-blue-200 text-blue-800',
  done: 'bg-green-200 text-green-800',
  blocked: 'bg-red-200 text-red-800',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const TaskCard = ({ task }) => {
  return (
    <div className="border rounded-lg p-3 shadow-sm bg-white hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-900">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}
        >
          {task.status}
        </span>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
        {task.assignee && (
          <span className="flex items-center gap-1">
            <FiUser className="w-3 h-3" />
            {task.assignee.name}
          </span>
        )}

        {task.dueDate && (
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
