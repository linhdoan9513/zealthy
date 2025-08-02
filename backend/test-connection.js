const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set!');
    console.log('Please set DATABASE_URL environment variable');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Users table accessible: ${userCount} users`);
    
    const configCount = await prisma.onboardingConfig.count();
    console.log(`✅ OnboardingConfig table accessible: ${configCount} configs`);
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 