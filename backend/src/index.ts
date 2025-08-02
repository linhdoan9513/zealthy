import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import { db } from './utils/db';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://frontend-g068m1bsq-linhs-projects-483a1d93.vercel.app',
    'https://zealthy.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Zealthy Backend API is running!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database connection test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ 
        error: 'DATABASE_URL not configured',
        status: 'FAILED',
        env: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          hasDatabaseUrl: !!process.env.DATABASE_URL
        }
      });
    }
    
    // Test database connection with a simple count query
    await db.$connect();
    const userCount = await db.user.count();
    const configCount = await db.onboardingConfig.count();
    
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      data: {
        users: userCount,
        configs: configCount
      },
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({ 
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      timestamp: new Date().toISOString()
    });
  } finally {
    await db.$disconnect();
  }
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    console.log(`⚙️  Admin API: http://localhost:${PORT}/api/admin`);
  });
}

// Export for Vercel
export default app; 