import { Request, Response } from 'express';
import { db } from '../utils/db';
import { CreateUserRequest, UpdateUserRequest } from '../types';

export const createUser = async (req: Request, res: Response) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing'
      });
    }

    const { email, password, firstName, lastName }: CreateUserRequest = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, firstName, and lastName are required' });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await db.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
      }
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing'
      });
    }

    const { id } = req.params;
    const updateData: UpdateUserRequest = req.body;

    // Convert birthdate string to Date if provided
    if (updateData.birthdate) {
      updateData.birthdate = new Date(updateData.birthdate).toISOString();
    }

    const user = await db.user.update({
      where: { id },
      data: updateData
    });

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      aboutMe: user.aboutMe,
      street: user.street,
      city: user.city,
      state: user.state,
      zip: user.zip,
      birthdate: user.birthdate,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing'
      });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        aboutMe: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        birthdate: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    
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

export const getUserById = async (req: Request, res: Response) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not configured');
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is missing'
      });
    }

    const { id } = req.params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        aboutMe: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        birthdate: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    
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