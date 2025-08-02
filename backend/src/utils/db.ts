import { PrismaClient } from '@prisma/client';

// Use a singleton pattern to prevent multiple Prisma instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Retry mechanism for database operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // If it's a prepared statement error, retry
      if (error instanceof Error && error.message.includes('prepared statement')) {
        if (attempt < maxRetries) {
          console.log(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
      }
      
      // For other errors, don't retry
      throw error;
    }
  }
  
  throw lastError!;
}

// Wrapper functions for common database operations
export const db = {
  user: {
    findMany: (args?: any) => withRetry(() => prisma.user.findMany(args)),
    findUnique: (args: any) => withRetry(() => prisma.user.findUnique(args)),
    create: (args: any) => withRetry(() => prisma.user.create(args)),
    update: (args: any) => withRetry(() => prisma.user.update(args)),
    count: (args?: any) => withRetry(() => prisma.user.count(args)),
  },
  onboardingConfig: {
    findMany: (args?: any) => withRetry(() => prisma.onboardingConfig.findMany(args)),
    create: (args: any) => withRetry(() => prisma.onboardingConfig.create(args)),
    deleteMany: (args?: any) => withRetry(() => prisma.onboardingConfig.deleteMany(args)),
    count: (args?: any) => withRetry(() => prisma.onboardingConfig.count(args)),
  },
  $connect: () => prisma.$connect(),
  $disconnect: () => prisma.$disconnect(),
};

export default prisma; 