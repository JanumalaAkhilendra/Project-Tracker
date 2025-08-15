import { useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const TaskList = ({ projectId, tasks, onTaskUpdated, onTaskDeleted, token }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setDeletingTaskId(taskId);
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskDeleted?.(taskId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Start editing
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedStatus(task.status);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedTitle('');
    setEditedStatus('');
  };

  // Save edited task
  const saveEditing = async (taskId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`,
        { title: editedTitle, status: editedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskUpdated?.(data);
      setEditingTaskId(null);
      setEditedTitle('');
      setEditedStatus('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'todo':
        return { 
          label: 'To Do', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: FiClock,
          dot: 'bg-gray-400'
        };
      case 'in-progress':
        return { 
          label: 'In Progress', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: FiClock,
          dot: 'bg-blue-500'
        };
      case 'done':
        return { 
          label: 'Completed', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: FiCheckCircle,
          dot: 'bg-green-500'
        };
      case 'blocked':
        return { 
          label: 'Blocked', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: FiAlertCircle,
          dot: 'bg-red-500'
        };
      default:
        return { 
          label: status, 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: FiClock,
          dot: 'bg-gray-400'
        };
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Create your first task to get started with this project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const statusInfo = getStatusInfo(task.status);
        const StatusIcon = statusInfo.icon;
        const isDeleting = deletingTaskId === task._id;
        
        return (
          <div
            key={task._id}
            className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
              isDeleting ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {/* Status indicator bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusInfo.dot}`}></div>
            
            <div className="p-6 pl-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {editingTaskId === task._id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter task title..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                          {task.title}
                        </h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Task metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.priority && (
                          <span className={`px-2 py-1 rounded-full ${
                            task.priority === 'high' || task.priority === 'critical' 
                              ? 'bg-red-100 text-red-700' 
                              : task.priority === 'medium' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {task.priority} priority
                          </span>
                        )}
                        {task.createdAt && (
                          <span className="flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            Created {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {editingTaskId === task._id ? (
                    <>
                      <button
                        onClick={() => saveEditing(task._id)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        title="Save changes"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                        title="Cancel editing"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        title="Edit task"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                        title="Delete task"
                      >
                        {isDeleting ? (
                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiTrash2 className="w-5 h-5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;