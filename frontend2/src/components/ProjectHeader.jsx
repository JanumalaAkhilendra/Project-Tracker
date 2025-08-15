import { FiUsers, FiCalendar } from 'react-icons/fi';
import Avatar from './Avatar';

const ProjectHeader = ({ project }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="mt-2 text-gray-600">{project.description}</p>
          )}
        </div>
        {project.deadline && (
          <div className="mt-4 md:mt-0 flex items-center text-gray-500">
            <FiCalendar className="mr-2" />
            <span>{formatDate(project.deadline)}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Owner:</span>
          {project.owner ? (
            <Avatar user={project.owner} size="sm" />
          ) : (
            <span className="text-gray-500">No owner assigned</span>
          )}
        </div>

        <div className="flex items-center">
          <FiUsers className="mr-2 text-gray-500" />
          <span className="text-sm text-gray-700">
            {project.members?.length || 0} Members
          </span>
        </div>

        {project.members && project.members.length > 0 && (
          <div className="flex -space-x-2">
            {project.members.slice(0, 5).map((member) => (
              <Avatar key={member._id} user={member} size="sm" />
            ))}
            {project.members.length > 5 && (
              <span className="text-xs text-gray-500 ml-2">
                +{project.members.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
