const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function diagnose() {
  console.log('🔍 Zealthy Backend Diagnosis');
  console.log('============================\n');

  // 1. Environment Variables Check
  console.log('1. Environment Variables:');
  console.log('   - NODE_ENV:', process.env.NODE_ENV || '❌ Not set');
  console.log('   - PORT:', process.env.PORT || '❌ Not set');
  console.log('   - DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  
  if (process.env.DATABASE_URL) {
    // Mask the URL for security
    const maskedUrl = process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log('   - DATABASE_URL (masked):', maskedUrl);
  }
  console.log('');

  // 2. Database Connection Test
  console.log('2. Database Connection Test:');
  if (!process.env.DATABASE_URL) {
    console.log('   ❌ DATABASE_URL is not configured!');
    console.log('   💡 Solution: Set DATABASE_URL environment variable');
    console.log('');
    return;
  }

  try {
    console.log('   🔌 Attempting to connect...');
    await prisma.$connect();
    console.log('   ✅ Database connection successful!');
    
    // 3. Schema Check
    console.log('\n3. Database Schema Check:');
    try {
      const userCount = await prisma.user.count();
      console.log('   ✅ Users table exists:', userCount, 'records');
    } catch (error) {
      console.log('   ❌ Users table error:', error.message);
    }

    try {
      const configCount = await prisma.onboardingConfig.count();
      console.log('   ✅ OnboardingConfig table exists:', configCount, 'records');
    } catch (error) {
      console.log('   ❌ OnboardingConfig table error:', error.message);
    }

    // 4. Test API Endpoints
    console.log('\n4. API Endpoint Tests:');
    console.log('   📋 Test these endpoints in your browser:');
    console.log('   - Health check: https://your-backend-url.vercel.app/health');
    console.log('   - Database test: https://your-backend-url.vercel.app/api/test-db');
    console.log('   - Users API: https://your-backend-url.vercel.app/api/users');
    console.log('   - Admin config: https://your-backend-url.vercel.app/api/admin/config');

  } catch (error) {
    console.log('   ❌ Database connection failed:', error.message);
    
    // Provide specific solutions based on error type
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Connection Error Solutions:');
      console.log('   1. Check if your database server is running');
      console.log('   2. Verify the DATABASE_URL is correct');
      console.log('   3. Check if the database exists');
      console.log('   4. Verify network connectivity');
    }
    
    if (error.message.includes('relation') || error.message.includes('table')) {
      console.log('\n💡 Schema Error Solutions:');
      console.log('   1. Run database migrations: npx prisma migrate deploy');
      console.log('   2. Generate Prisma client: npx prisma generate');
      console.log('   3. Check if migrations are up to date');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication Error Solutions:');
      console.log('   1. Check database username/password in DATABASE_URL');
      console.log('   2. Verify database permissions');
      console.log('   3. Check if the user exists in the database');
    }
  } finally {
    await prisma.$disconnect();
  }

  // 5. Deployment Check
  console.log('\n5. Deployment Status:');
  console.log('   📦 Check if your backend is deployed:');
  console.log('   - Visit: https://your-backend-url.vercel.app/');
  console.log('   - Should show: "Zealthy Backend API is running!"');
  console.log('');

  // 6. Common Issues
  console.log('6. Common Issues & Solutions:');
  console.log('   ❌ 500 errors usually mean:');
  console.log('     1. DATABASE_URL not set in Vercel environment variables');
  console.log('     2. Database connection issues');
  console.log('     3. Missing database migrations');
  console.log('     4. Incorrect database credentials');
  console.log('');
  console.log('   💡 Quick fixes:');
  console.log('     1. Set DATABASE_URL in Vercel dashboard');
  console.log('     2. Run: npx prisma migrate deploy');
  console.log('     3. Run: npx prisma generate');
  console.log('     4. Redeploy your backend');
}

diagnose().catch(console.error); 