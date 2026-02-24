import express from 'express';
import { client } from './middleware.js';

const router = express.Router();

// ==================== ROUTES ====================

// Metrics route
router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (error) {
    console.error(`ERROR: Failed to fetch metrics - ${error.message}`);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to fetch metrics',
      error: error.message
    });
  }
});

// Health check route
router.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Error route (returns an error)
router.get('/error', (req, res) => {
  console.error('ERROR: Test error endpoint hit - Something went wrong!');
  res.status(500).json({
    status: 'ERROR',
    message: 'This is a test error route',
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// Heavy task route (waits for 5 seconds)
router.get('/heavy-task', async (req, res) => {
  console.log('Heavy task endpoint hit');
  try {
    // Simulate a heavy task by waiting 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    res.status(200).json({
      status: 'OK',
      message: 'Heavy task completed after 5 seconds',
      duration: '5000ms',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`ERROR: Heavy task failed - ${error.message}`);
    res.status(500).json({
      status: 'ERROR',
      message: 'Heavy task failed',
      error: error.message
    });
  }
});

export default router;
