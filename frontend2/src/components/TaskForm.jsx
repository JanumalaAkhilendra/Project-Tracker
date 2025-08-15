import { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ projectId, setTasks }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/tasks`,
        {
          title,
          status,
          project: projectId,
          priority, // Added priority to the request body
        },
        {
          withCredentials: true,
        }
      );
      // Optional: Update state in parent component if needed
      // setTasks(prevTasks => [...prevTasks, data]); 
      setTitle('');
      setStatus('todo');
      setPriority('medium');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-xl bg-white border space-y-5 transition-all duration-300 ease-in-out"
    >
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Task Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          placeholder="e.g., Design homepage layout"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white cursor-pointer appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white cursor-pointer appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 transform hover:-translate-y-0.5"
      >
        {loading ? 'Adding Task...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;