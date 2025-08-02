const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  console.log('Environment variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', process.env.PORT);
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not configured!');
    console.log('Please set the DATABASE_URL environment variable.');
    process.exit(1);
  }

  try {
    console.log('\n🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    console.log('\n📊 Testing queries...');
    const userCount = await prisma.user.count();
    const configCount = await prisma.onboardingConfig.count();
    
    console.log(`✅ Users table: ${userCount} records`);
    console.log(`✅ OnboardingConfig table: ${configCount} records`);
    
    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if your database server is running');
      console.log('2. Verify the DATABASE_URL is correct');
      console.log('3. Check if the database exists');
    }
    
    if (error.message.includes('relation') || error.message.includes('table')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Run database migrations: npx prisma migrate deploy');
      console.log('2. Generate Prisma client: npx prisma generate');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 