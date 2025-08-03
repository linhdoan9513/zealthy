# Zealthy - Full Stack Application

A modern full-stack application built with Next.js frontend and Express.js backend with PostgreSQL database.

## 🏗️ Project Structure

```
Zealthy/
├── frontend/          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/ # React components
│   │   ├── services/  # API services
│   │   ├── types/     # TypeScript types
│   │   └── utils/     # Utility functions
│   ├── public/       # Static assets
│   └── package.json
├── backend/           # Express.js Backend API
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   ├── prisma/         # Database schema and migrations
│   └── package.json
└── package.json       # Root monorepo configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** 
- **npm or yarn**
- **PostgreSQL** (for database)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Zealthy
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Set up the database:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. **Start development servers:**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually:
   npm run dev:frontend  # Frontend on http://localhost:3000
   npm run dev:backend   # Backend on http://localhost:5000
   ```

## 📁 Frontend (Next.js)

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Material-UI
- **State Management:** React Query (TanStack Query)
- **Form Handling:** React Hook Form + Yup validation
- **Port:** 3000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

### Frontend Scripts
```bash
cd frontend
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run ESLint
```

## 🔧 Backend (Express.js)

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Port:** 5000

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```

4. **Configure your `.env` file:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/zealthy_db"
   
   # JWT Configuration (for authentication)
   JWT_SECRET=your_jwt_secret_here
   
   # API Keys (for future use)
   API_KEY=your_api_key_here
   ```

5. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # (Optional) Run migrations
   npx prisma migrate dev
   
   # (Optional) Open Prisma Studio
   npx prisma studio
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

### Backend Scripts
```bash
cd backend
npm run dev              # Development server with nodemon
npm run build            # TypeScript compilation
npm run start            # Production server
npm run test-db          # Test database connection
npm run diagnose         # Run Prisma diagnose
npm run test-connection  # Test database connection
```

## 🗄️ Database Setup

### PostgreSQL Installation

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### Create Database

1. **Access PostgreSQL:**
   ```bash
   psql -U postgres
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE zealthy_db;
   CREATE USER zealthy_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE zealthy_db TO zealthy_user;
   ```

3. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://zealthy_user:your_password@localhost:5432/zealthy_db"
   ```

### Database Management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create and run migrations
npx prisma migrate dev --name migration_name

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 🌐 API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Admin Routes
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/onboarding-config` - Get onboarding configuration
- `POST /api/admin/onboarding-config` - Update onboarding configuration

### Health Check
- `GET /` - API status
- `GET /health` - Health check

## 🛠️ Development

### Monorepo Scripts
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run start            # Start both in production mode
npm run install:all      # Install dependencies for all packages
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
```

### Environment Variables

**Backend (.env):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/zealthy_db"

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# API Keys
API_KEY=your_api_key_here
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Yup** - Schema validation
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Nodemon** - Development server with auto-restart

## 🔄 Development Workflow

1. **Database Changes:**
   - Update `backend/prisma/schema.prisma`
   - Run `npx prisma generate`
   - Run `npx prisma db push` or create migration

2. **Backend Development:**
   - Edit files in `backend/src/`
   - API runs on port 5000
   - Hot reload with nodemon

3. **Frontend Development:**
   - Edit files in `frontend/src/`
   - App runs on port 3000
   - Hot reload with Next.js

4. **API Integration:**
   - Frontend connects to backend via `NEXT_PUBLIC_API_URL`
   - CORS configured for local development

## 🚀 Deployment

### Frontend Deployment
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any static hosting**

### Backend Deployment
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**
- **AWS EC2**
- **Vercel** (serverless functions)

### Database Deployment
- **Railway PostgreSQL**
- **Heroku Postgres**
- **AWS RDS**
- **DigitalOcean Managed Databases**

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   ```bash
   # Check if PostgreSQL is running
   brew services list | grep postgresql
   
   # Test connection
   cd backend
   npm run test-connection
   ```

2. **Port Already in Use:**
   ```bash
   # Find process using port
   lsof -i :5000
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Prisma Issues:**
   ```bash
   # Reset Prisma
   npx prisma generate
   npx prisma db push
   
   # Or reset database
   npx prisma migrate reset
   ```

4. **Node Modules Issues:**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📝 License

ISC 