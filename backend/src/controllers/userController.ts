import { Request, Response } from 'express';
import { db } from '../utils/db';
import { CreateUserRequest, UpdateUserRequest } from '../types';
import { handleDatabaseError, checkDatabaseUrl } from '../utils/errorHandler';

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!checkDatabaseUrl(res)) return;

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
    handleDatabaseError(error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!checkDatabaseUrl(res)) return;

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
    handleDatabaseError(error, res);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (!checkDatabaseUrl(res)) return;

    // Extract sorting parameters from query string
    const { sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Validate sortBy parameter
    const validSortFields = [
      'firstName', 'lastName', 'email', 'birthdate', 
      'createdAt', 'updatedAt'
    ];
    
    if (!validSortFields.includes(sortBy as string)) {
      return res.status(400).json({ 
        error: 'Invalid sort field',
        validFields: validSortFields
      });
    }
    
    // Validate sortOrder parameter
    if (!['asc', 'desc'].includes(sortOrder as string)) {
      return res.status(400).json({ 
        error: 'Invalid sort order. Must be "asc" or "desc"'
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
        [sortBy as string]: sortOrder as 'asc' | 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    if (!checkDatabaseUrl(res)) return;

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
    handleDatabaseError(error, res);
  }
}; 