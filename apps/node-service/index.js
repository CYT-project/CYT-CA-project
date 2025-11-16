// Node.js microservice for CIV2025 template
// This demonstrates a basic Express server that can be containerized and deployed via CI/CD

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Basic health check endpoint - useful for load balancers and monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'node-service', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CIV2025 Node Service',
    endpoints: ['/health', '/api/info'],
    version: '1.0.0'
  });
});

// API endpoint example
app.get('/api/info', (req, res) => {
  res.json({
    service: 'node-service',
    description: 'Template microservice for CI/CD learning',
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Node service running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
