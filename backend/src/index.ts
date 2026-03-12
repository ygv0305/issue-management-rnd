import express from 'express';

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

// Handles server shutdown gracefully
const handleServerShutdown = async () => {
  try {
    console.log('Server Shutdown');
    process.exit(0);
  } catch (error) {
    console.log('Error during server shutdown', error);
  }
};
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
