import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import KanbanBoard from '../components/KanbanBoard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import ProjectHeader from '../components/ProjectHeader';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user, token } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('kanban');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch project details
        const { data: projectRes } = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          config
        );
        setProject(projectRes.data);

        // Fetch tasks
        const { data: taskRes } = await axios.get(
          `http://localhost:5000/api/projects/${projectId}/tasks`,
          config
        );
        setTasks(taskRes.data);

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto pt-20">
          <Alert type="error" message={error} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto pt-20">
          <Alert type="error" message="Project not found" />
        </div>
      </div>
    );
  }

  const canCreateTask =
    user?.role === 'owner' ||
    project.members?.some((m) => m._id === user?._id);

  // Handle task update
  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  // Handle task delete
  const handleTaskDeleted = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  // Handle new task creation
  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <ProjectHeader project={project} />

        {/* View Toggle */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Project Management</h2>
            
            <div className="flex bg-gray-100/70 rounded-xl p-1">
              <button
                onClick={() => setActiveView('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeView === 'kanban'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9z"></path>
                </svg>
                Kanban Board
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeView === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Task Creation Form */}
        {canCreateTask && (
          <div className="mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                </div>
              </div>
              <div className="p-6">
                <TaskForm 
                  projectId={projectId} 
                  setTasks={setTasks} 
                  token={token}
                  onTaskCreated={handleTaskCreated}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tasks Display */}
        <div className="mt-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeView === 'kanban' ? 'Kanban Board' : 'Task List'}
                  </h3>
                </div>
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {activeView === 'kanban' ? (
                <KanbanBoard tasks={tasks} />
              ) : (
                <TaskList
                  projectId={projectId}
                  tasks={tasks}
                  onTaskUpdated={handleTaskUpdated}
                  onTaskDeleted={handleTaskDeleted}
                  token={token}
                />
              )}
            </div>
          </div>
        </div>

        {/* Project Statistics */}
        {tasks.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {tasks.filter(t => t.status === 'todo').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">To Do</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">In Progress</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {tasks.filter(t => t.status === 'done').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Completed</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {tasks.filter(t => t.status === 'blocked').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Blocked</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;