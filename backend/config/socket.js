const socketio = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: process.env.FRONTEND_URL, // http://localhost:5173
      methods: ['GET', 'POST'],
      credentials: true, // 👈 important for cookies/auth headers
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`User joined project room: ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
