import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import JoinProjectModal from '../components/JoinProjectModal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/projects');
        setProjects(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProjects();
  }, [user]);

  const handleCreateProject = async (projectData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/projects', projectData);
      setProjects([...projects, data.data]);
      setShowCreateModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleJoinProject = async (inviteCode) => {
    try {
      const { data } = await axios.post(`http://localhost:5000/api/projects/join/${inviteCode}`);
      setProjects([...projects, data.data]);
      setShowJoinModal(false);
    } catch (err) {
      throw err.response?.data?.message || 'Failed to join project';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600 font-medium">Loading your projects...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and Welcome */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your projects and collaborate with your team
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-3">
              {user?.role === 'owner' && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span className="hidden xs:inline">Create Project</span>
                    <span className="xs:hidden">Create</span>
                  </div>
                </button>
              )}
              
              <button 
                onClick={() => setShowJoinModal(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  <span className="hidden xs:inline">Join Project</span>
                  <span className="xs:hidden">Join</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Projects
              <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </span>
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="max-w-md mx-auto">
                {/* Empty State Icon */}
                <div className="mx-auto w-44 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  No projects yet
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
                  Get started by {user?.role === 'owner' ? 'creating your first project' : 'joining an existing project'} and begin collaborating with your team.
                </p>
                
                {/* Quick Action Buttons */}
                <div className="flex flex-col xs:flex-row gap-3 justify-center">
                  {user?.role === 'owner' && (
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Create Your First Project
                    </button>
                  )}
                  <button 
                    onClick={() => setShowJoinModal(true)}
                    className="bg-white text-gray-700 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Join a Project
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {projects.map(project => (
                <div 
                  key={project._id} 
                  className="transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics Section (if projects exist) */}
        {projects.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {projects.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  Total Projects
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">
                  {projects.filter(p => p.status === 'active').length || projects.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  Active Projects
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                  {user?.role === 'owner' ? projects.length : '—'}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  Owned
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-gray-200/50 hover:bg-white/90 transition-all duration-200">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                  {projects.reduce((acc, p) => acc + (p.members?.length || 1), 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  Team Members
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateProjectModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />

      <JoinProjectModal 
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinProject}
      />
    </div>
  );
};

export default Dashboard;