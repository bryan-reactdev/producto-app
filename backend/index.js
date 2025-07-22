// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure CORS for production
const corsOptions = {
  origin: isProduction ? process.env.FRONTEND_URL : '*',
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware for production
if (isProduction) {
  // Add helmet for security headers
  const helmet = require('helmet');
  app.use(helmet());
  
  // Add rate limiting
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  });
  app.use('/api/', limiter);
  
  // Add compression
  const compression = require('compression');
  app.use(compression());
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!', environment: isProduction ? 'production' : 'development' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
    version: require('./package.json').version
  });
});

// Product routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const productGroupRoutes = require('./routes/productGroupRoutes');
app.use('/api/groups', productGroupRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  const message = isProduction ? 'Internal Server Error' : err.message;
  res.status(statusCode).json({ error: message });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
}); 