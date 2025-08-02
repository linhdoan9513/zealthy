import { Request, Response } from 'express';
import prisma from '../services/database';
import { CreateUserRequest, UpdateUserRequest } from '../types';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName }: CreateUserRequest = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, firstName, and lastName are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await prisma.user.create({
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateUserRequest = req.body;

    // Convert birthdate string to Date if provided
    if (updateData.birthdate) {
      updateData.birthdate = new Date(updateData.birthdate).toISOString();
    }

    const user = await prisma.user.update({
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
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
    res.status(500).json({ error: 'Internal server error' });
  }
}; 