import { Request, Response } from 'express';
import prisma from '../services/database';
import { UpdateConfigRequest } from '../types';

export const getOnboardingConfig = async (req: Request, res: Response) => {
  try {
    const configs = await prisma.onboardingConfig.findMany({
      orderBy: [
        { page: 'asc' },
        { order: 'asc' }
      ]
    });

    // Group by page
    const groupedConfigs = {
      page2: configs.filter(c => c.page === 2),
      page3: configs.filter(c => c.page === 3)
    };

    res.json(groupedConfigs);
  } catch (error) {
    console.error('Error fetching onboarding config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOnboardingConfig = async (req: Request, res: Response) => {
  try {
    const { page, components }: UpdateConfigRequest = req.body;

    if (!page || !components || !Array.isArray(components)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Delete existing configs for this page
    await prisma.onboardingConfig.deleteMany({
      where: { page }
    });

    // Create new configs
    const newConfigs = await Promise.all(
      components.map(async (comp, index) => {
        return prisma.onboardingConfig.create({
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const initializeDefaultConfig = async (req: Request, res: Response) => {
  try {
    // Delete all existing configurations
    await prisma.onboardingConfig.deleteMany();

    // Create default configuration - each page must have at least one component
    const defaultConfigs = [
      // Page 2: About Me
      { page: 2, component: 'aboutMe', order: 0 },
      // Page 3: Address
      { page: 3, component: 'address', order: 0 }
    ];

    const configs = await Promise.all(
      defaultConfigs.map(config => 
        prisma.onboardingConfig.create({ data: config })
      )
    );

    res.status(201).json(configs);
  } catch (error) {
    console.error('Error initializing default config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 