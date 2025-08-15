import { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { socket } from '../socket';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const [projectRes, tasksRes] = await Promise.all([
          axios.get(`/api/projects/${projectId}`),
          axios.get(`/api/projects/${projectId}/tasks`),
        ]);

        setProject(projectRes.data.data);
        setTasks(tasksRes.data.data);
        setMembers(projectRes.data.data.members);
        
        // Join project room for real-time updates
        socket.emit('joinProject', projectId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();

    // Socket event listeners
    const handleTaskCreated = (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    };

    const handleTaskDeleted = (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    };

    const handleCommentAdded = ({ taskId, comment }) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, comments: [...task.comments, comment] }
            : task
        )
      );
    };

    socket.on('taskCreated', handleTaskCreated);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);
    socket.on('commentAdded', handleCommentAdded);

    return () => {
      socket.off('taskCreated', handleTaskCreated);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);
      socket.off('commentAdded', handleCommentAdded);
    };
  }, [projectId, token]);

  const createTask = async (taskData) => {
    try {
      const { data } = await axios.post(
        `/api/projects/${projectId}/tasks`,
        taskData
      );
      return data.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to create task';
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const { data } = await axios.put(`/api/tasks/${taskId}`, updates);
      return data.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update task';
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
    } catch (err) {
      throw err.response?.data?.message || 'Failed to delete task';
    }
  };

  const addComment = async (taskId, text) => {
    try {
      const { data } = await axios.post(`/api/tasks/${taskId}/comments`, { text });
      return data.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to add comment';
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        tasks,
        members,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        addComment,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);