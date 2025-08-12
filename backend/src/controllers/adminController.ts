import { Request, Response } from 'express';
import { db } from '../utils/db';
import { UpdateConfigRequest } from '../types';
import { handleDatabaseError, checkDatabaseUrl } from '../utils/errorHandler';
import { getAllDefaultConfigs } from '../config/defaultOnboardingConfig';

export const getOnboardingConfig = async (req: Request, res: Response) => {
  try {
    if (!checkDatabaseUrl(res)) return;

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
    handleDatabaseError(error, res);
  }
};

export const updateOnboardingConfig = async (req: Request, res: Response) => {
  try {
    if (!checkDatabaseUrl(res)) return;

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
    handleDatabaseError(error, res);
  }
};

export const initializeDefaultConfig = async (req: Request, res: Response) => {
  try {
    if (!checkDatabaseUrl(res)) return;

    // Delete all existing configurations
    await db.onboardingConfig.deleteMany();

    // Create default configuration from external config file
    const defaultConfigs = getAllDefaultConfigs();

    const configs = await Promise.all(
      defaultConfigs.map(config => 
        db.onboardingConfig.create({ 
          data: {
            page: config.page,
            component: config.component,
            order: config.order
          }
        })
      )
    );

    res.status(201).json(configs);
  } catch (error) {
    handleDatabaseError(error, res);
  }
}; 