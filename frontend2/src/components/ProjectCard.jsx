import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiFolder } from 'react-icons/fi';
import Avatar from './Avatar';

const ProjectCard = ({ project }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <FiFolder className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{project.name}</h3>
          </div>
          {project.owner && (
            <div className="flex-shrink-0 ml-4">
              <Avatar user={project.owner} size="sm" />
            </div>
          )}
        </div>
        
        {project.description && (
          <p className="mt-2 text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-2">{project.description}</p>
        )}
        
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between text-sm text-gray-500 space-y-2 md:space-y-0">
          <div className="flex items-center">
            <FiUsers className="mr-2 text-gray-400" />
            <span>{project.members?.length || 0} members</span>
          </div>
          
          {project.deadline && (
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-gray-400" />
              <span>Due: {formatDate(project.deadline)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;