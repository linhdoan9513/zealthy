# Zealthy - Full Stack Application

A modern full-stack application built with Next.js frontend and Express.js backend.

## 🏗️ Project Structure

```
Zealthy/
├── frontend/          # Next.js Frontend Application
│   ├── src/
│   │   └── app/      # App Router pages
│   ├── public/       # Static assets
│   └── package.json
├── backend/           # Express.js Backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
└── package.json       # Root monorepo configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Start development servers:**
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
- **Styling:** Tailwind CSS
- **Linting:** ESLint
- **Port:** 3000

### Frontend Scripts
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
```

## 🔧 Backend (Express.js)

- **Framework:** Express.js
- **Language:** TypeScript
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Port:** 5000

### Backend Scripts
```bash
cd backend
npm run dev      # Development server with nodemon
npm run build    # TypeScript compilation
npm run start    # Production server
```

## 🌐 API Endpoints

- `GET /` - API status
- `GET /health` - Health check

## 🛠️ Development

### Monorepo Scripts
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run start            # Start both in production mode
npm run install:all      # Install dependencies for all packages
```

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
```

## 📦 Technologies Used

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- ESLint

### Backend
- Express.js
- TypeScript
- Helmet (Security)
- CORS
- Morgan (Logging)
- Nodemon (Development)

## 🔄 Development Workflow

1. **Frontend Development:** Edit files in `frontend/src/`
2. **Backend Development:** Edit files in `backend/src/`
3. **API Integration:** Backend runs on port 5000, frontend on port 3000
4. **Hot Reload:** Both servers support hot reloading

## 🚀 Deployment

### Frontend
- Vercel (recommended for Next.js)
- Netlify
- Any static hosting

### Backend
- Railway
- Heroku
- DigitalOcean
- AWS

## 📝 License

ISC 