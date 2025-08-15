import { io } from 'socket.io-client';

// Create the socket instance
const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false, // We'll manually connect after auth
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

/**
 * Initialize socket event listeners
 * @param {Object} handlers - Event handlers for socket events
 */
const initSocket = (handlers = {}) => {
  // Task events
  socket.on('taskCreated', (task) => {
    handlers.onTaskCreated?.(task);
  });

  socket.on('taskUpdated', (task) => {
    handlers.onTaskUpdated?.(task);
  });

  socket.on('taskDeleted', (taskId) => {
    handlers.onTaskDeleted?.(taskId);
  });

  // Comment events
  socket.on('commentAdded', ({ taskId, comment }) => {
    handlers.onCommentAdded?.({ taskId, comment });
  });

  // Connection events
  socket.on('connect', () => {
    console.log('Socket connected');
    handlers.onConnect?.();
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    handlers.onDisconnect?.();
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
    handlers.onConnectError?.(err);
  });
};

/**
 * Clean up socket event listeners
 */
const cleanupSocket = () => {
  socket.off('taskCreated');
  socket.off('taskUpdated');
  socket.off('taskDeleted');
  socket.off('commentAdded');
  socket.off('connect');
  socket.off('disconnect');
  socket.off('connect_error');
};

// Export as named exports
export { socket, initSocket, cleanupSocket };