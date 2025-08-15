// server.js
require('dotenv').config();
const app = require('./app');
const { initSocket } = require('./config/socket');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to database first
connectDB()
  .then(() => {
    // Then start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    
    // Initialize Socket.io
    initSocket(server);
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });