import { Response } from 'express';

export const handleDatabaseError = (error: unknown, res: Response): void => {
  console.error('Database operation error:', error);
  
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not configured');
    res.status(500).json({ 
      error: 'Database configuration error',
      details: 'DATABASE_URL environment variable is missing'
    });
    return;
  }

  // Provide more specific error messages
  if (error instanceof Error) {
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message
      });
      return;
    }
    if (error.message.includes('relation') || error.message.includes('table')) {
      res.status(500).json({ 
        error: 'Database schema error',
        details: 'Database tables may not be migrated. Run: npx prisma migrate deploy'
      });
      return;
    }
    if (error.message.includes('DATABASE_URL')) {
      res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing or invalid'
      });
      return;
    }
    if (error.message.includes('prepared statement')) {
      res.status(500).json({ 
        error: 'Database connection pooling error',
        details: 'Connection pool issue. Please try again.'
      });
      return;
    }
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    details: error instanceof Error ? error.message : 'Unknown error'
  });
};

export const checkDatabaseUrl = (res: Response): boolean => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not configured');
    res.status(500).json({ 
      error: 'Database configuration error',
      details: 'DATABASE_URL environment variable is missing'
    });
    return false;
  }
  return true;
};