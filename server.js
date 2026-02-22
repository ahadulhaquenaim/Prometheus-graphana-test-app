const express = require('express');
const router = require('./router'); // Import routes
const { metricsMiddleware } = require('./middleware'); // Import metrics middleware

require('dotenv').config() // Load environment variables from .env file
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Metrics collection middleware
app.use(metricsMiddleware);

// ==================== ROUTES ====================
app.use(router); // Use the router from router.js

// ==================== ERROR HANDLERS ====================

// 404 route handler
app.use((req, res) => {
  res.status(404).json({
    status: 'NOT_FOUND',
    message: 'Route not found',
    path: req.path
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📍 Available routes:`);
  console.log(`   - GET /health (simple health check)`);
  console.log(`   - GET /error (returns an error)`);
  console.log(`   - GET /heavy-task (5 second response time)`);
});


// short lived scripts how to fetch metrics and log data from loki and prometheus
