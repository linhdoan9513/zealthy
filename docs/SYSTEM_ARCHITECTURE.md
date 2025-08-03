# System Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Data Flow](#data-flow)
5. [Integration Patterns](#integration-patterns)
6. [Security Architecture](#security-architecture)
7. [Performance Architecture](#performance-architecture)
8. [Scalability](#scalability)
9. [Monitoring & Observability](#monitoring--observability)
10. [Deployment Architecture](#deployment-architecture)
11. [Development Workflow](#development-workflow)

## Overview

The Zealthy system is a full-stack web application designed to provide health-related services with a focus on user onboarding, profile management, and administrative functions. The system follows a modern microservices-inspired architecture with clear separation between frontend and backend services.

### System Goals
- **Scalability**: Handle growing user base and data volume
- **Performance**: Fast response times and optimal user experience
- **Security**: Protect user data and ensure secure communications
- **Maintainability**: Clean code structure and clear separation of concerns
- **Reliability**: High availability and fault tolerance

## System Architecture

### High-Level System Architecture
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User Interface                                 │
│                        (Next.js Frontend)                                  │
└─────────────────────┬───────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API Gateway Layer                                 │
│                        (Express.js Backend)                                │
└─────────────────────┬───────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Data Access Layer                                  │
│                        (Prisma ORM)                                        │
└─────────────────────┬───────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Storage Layer                                │
│                        (PostgreSQL Database)                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • App Router    │    │ • Controllers   │    │ • User Data     │
│ • Components    │    │ • Services      │    │ • Config Data   │
│ • State Mgmt    │    │ • Middleware    │    │ • Migrations    │
│ • API Client    │    │ • Routes        │    │ • Indexes       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend Stack
- **Framework**: Next.js 14.2.5 with App Router
- **Language**: TypeScript 5.x
- **UI Library**: Material-UI 7.2.0 + Tailwind CSS 3.4.17
- **State Management**: React Query (TanStack Query) 5.84.1
- **Form Handling**: React Hook Form 7.62.0 + Yup 1.7.0
- **HTTP Client**: Axios 1.11.0

### UI/UX Design Decisions

#### Material-UI for Responsive Design
**Decision**: Use Material-UI as the primary component library with Tailwind CSS for custom styling.

**Rationale**:
- **Built-in Responsiveness**: Material-UI components are designed with mobile-first responsive design principles
- **Consistent Design System**: Pre-built components follow Material Design guidelines for consistent user experience
- **Accessibility**: Components come with built-in accessibility features (ARIA labels, keyboard navigation)
- **Theme Customization**: Flexible theming system allows brand customization while maintaining design consistency
- **Component Variety**: Rich set of pre-built components (forms, navigation, data display, feedback)
- **Performance**: Optimized components with minimal bundle size impact
- **Developer Experience**: Excellent TypeScript support and comprehensive documentation

**Implementation Strategy**:
- **Core Components**: Use Material-UI for complex interactive components (forms, modals, navigation)
- **Custom Styling**: Tailwind CSS for layout, spacing, and custom design elements
- **Responsive Breakpoints**: Material-UI's responsive grid system for layout management
- **Theme Integration**: Custom Material-UI theme with brand colors and typography

### Backend Stack
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.9.2
- **Database ORM**: Prisma 6.13.0
- **Database**: PostgreSQL
- **Security**: Helmet 8.1.0, CORS 2.8.5
- **Logging**: Morgan 1.10.1

### Infrastructure Stack
- **Runtime**: Node.js 18+
- **Package Manager**: npm
- **Version Control**: Git
- **Deployment**: Vercel (Frontend), Vercel/Railway (Backend)
- **Database Hosting**: Supabase PostgreSQL

## Data Flow

### User Registration Flow
```
1. User fills registration form (Frontend)
   ↓
2. Form validation (Yup schema)
   ↓
3. API request to /api/users (Axios)
   ↓
4. Request validation (Backend middleware)
   ↓
5. Business logic processing (Controller)
   ↓
6. Database operation (Prisma ORM)
   ↓
7. Response to frontend
   ↓
8. UI update (React Query cache)
```

### Data Fetching Flow
```
1. Component mounts (React)
   ↓
2. React Query hook triggers
   ↓
3. API request (Axios)
   ↓
4. Backend processes request
   ↓
5. Database query (Prisma)
   ↓
6. Response with data
   ↓
7. Cache update (React Query)
   ↓
8. Component re-render
```

### Error Handling Flow
```
1. Error occurs (API/Database/Network)
   ↓
2. Error caught by try-catch
   ↓
3. Error formatted (Backend)
   ↓
4. HTTP error response
   ↓
5. Error handled by Axios interceptor
   ↓
6. React Query error state
   ↓
7. UI error display
```

## Integration Patterns

### API Integration Pattern
- **RESTful API Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON Data Format**: Consistent request/response structure
- **Error Handling**: Standardized error responses with status codes
- **Caching Strategy**: React Query for client-side caching

### Database Integration Pattern
- **ORM Layer**: Prisma for type-safe database operations
- **Connection Pooling**: Automatic connection management
- **Migration System**: Version-controlled database schema changes
- **Query Optimization**: Efficient database queries with indexing

### State Management Pattern
- **Server State**: React Query for API data management
- **Client State**: React hooks for local component state
- **Form State**: React Hook Form for form management
- **Global State**: Context API for theme and configuration

## Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   localhost:3000│◄──►│   localhost:5000│◄──►│   Supabase      │
│   (Next.js)     │    │   (Express.js)  │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Vercel Platform                                │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   Frontend      │    │   Backend       │    │   Database      │         │
│  │   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (Supabase)    │         │
│  │   zealthy.vercel│    │   API Routes    │    │   PostgreSQL    │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Environment Configuration
- **Development**: Local development with hot reloading, connected to Supabase dev database
- **Staging**: Pre-production testing environment with Supabase staging database
- **Production**: Live application with monitoring and logging, connected to Supabase production database

## Development Workflow

```

### Development Commands
- **Install Dependencies**: `npm run install:all`
- **Start Development**: `npm run dev`
- **Build Production**: `npm run build`
- **Database Operations**: Prisma commands for schema management

## Current API Endpoints

### Implemented Endpoints
```
POST   /api/users              # Create new user
PUT    /api/users/:id          # Update user by ID
GET    /api/users              # Get all users
GET    /api/users/:id          # Get user by ID
GET    /api/admin/users        # Get all users (admin)
GET    /api/admin/onboarding-config  # Get onboarding config
POST   /api/admin/onboarding-config  # Update onboarding config
GET    /                       # API status
GET    /health                 # Health check
GET    /api/test-db           # Database connection test
```

## Future Architecture Considerations

### Planned Enhancements
1. **Authentication Service**: JWT-based authentication with refresh tokens