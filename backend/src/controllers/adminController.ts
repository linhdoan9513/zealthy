import { Request, Response } from 'express';
import { db } from '../utils/db';
import { UpdateConfigRequest } from '../types';

export const getOnboardingConfig = async (req: Request, res: Response) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing'
      });
    }

    const configs = await db.onboardingConfig.findMany({
      orderBy: [
        { page: 'asc' },
        { order: 'asc' }
      ]
    });

    // Group by page
    const groupedConfigs = {
      page2: configs.filter((c: any) => c.page === 2),
      page3: configs.filter((c: any) => c.page === 3)
    };

    res.json(groupedConfigs);
  } catch (error) {
    console.error('Error fetching onboarding config:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        return res.status(500).json({ 
          error: 'Database connection failed',
          details: error.message
        });
      }
      if (error.message.includes('relation') || error.message.includes('table')) {
        return res.status(500).json({ 
          error: 'Database schema error',
          details: 'Database tables may not be migrated. Run: npx prisma migrate deploy'
        });
      }
      if (error.message.includes('DATABASE_URL')) {
        return res.status(500).json({ 
          error: 'Database configuration error',
          details: 'DATABASE_URL environment variable is missing or invalid'
        });
      }
      if (error.message.includes('prepared statement')) {
        return res.status(500).json({ 
          error: 'Database connection pooling error',
          details: 'Connection pool issue. Please try again.'
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOnboardingConfig = async (req: Request, res: Response) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing'
      });
    }

    const { page, components }: UpdateConfigRequest = req.body;

    if (!page || !components || !Array.isArray(components)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Delete existing configs for this page
    await db.onboardingConfig.deleteMany({
      where: { page }
    });

    // Create new configs
    const newConfigs = await Promise.all(
      components.map(async (comp, index) => {
        return db.onboardingConfig.create({
          data: {
            page,
            component: comp.component,
            order: comp.order || index
          }
        });
      })
    );

    res.json(newConfigs);
  } catch (error) {
    console.error('Error updating onboarding config:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        return res.status(500).json({ 
          error: 'Database connection failed',
          details: error.message
        });
      }
      if (error.message.includes('relation') || error.message.includes('table')) {
        return res.status(500).json({ 
          error: 'Database schema error',
          details: 'Database tables may not be migrated. Run: npx prisma migrate deploy'
        });
      }
      if (error.message.includes('DATABASE_URL')) {
        return res.status(500).json({ 
          error: 'Database configuration error',
          details: 'DATABASE_URL environment variable is missing or invalid'
        });
      }
      if (error.message.includes('prepared statement')) {
        return res.status(500).json({ 
          error: 'Database connection pooling error',
          details: 'Connection pool issue. Please try again.'
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const initializeDefaultConfig = async (req: Request, res: Response) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing'
      });
    }

    // Delete all existing configurations
    await db.onboardingConfig.deleteMany();

    // Create default configuration - each page must have at least one component
    const defaultConfigs = [
      // Page 2: About Me
      { page: 2, component: 'aboutMe', order: 0 },
      // Page 3: Address
      { page: 3, component: 'address', order: 0 }
    ];

    const configs = await Promise.all(
      defaultConfigs.map(config => 
        db.onboardingConfig.create({ data: config })
      )
    );

    res.status(201).json(configs);
  } catch (error) {
    console.error('Error initializing default config:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        return res.status(500).json({ 
          error: 'Database connection failed',
          details: error.message
        });
      }
      if (error.message.includes('relation') || error.message.includes('table')) {
        return res.status(500).json({ 
          error: 'Database schema error',
          details: 'Database tables may not be migrated. Run: npx prisma migrate deploy'
        });
      }
      if (error.message.includes('DATABASE_URL')) {
        return res.status(500).json({ 
          error: 'Database configuration error',
          details: 'DATABASE_URL environment variable is missing or invalid'
        });
      }
      if (error.message.includes('prepared statement')) {
        return res.status(500).json({ 
          error: 'Database connection pooling error',
          details: 'Connection pool issue. Please try again.'
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 