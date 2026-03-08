# ZPI-Website

## Project Overview

**Name:** ZPI-Website

**Goal:** A web platform that helps students and faculty manage final engineering project topics, assignments, opinions, and required declarations. 

**Tech Stack:** React, Node.js, PostgreSQL, Prisma, Docker, Vite, TailwindCSS, Cypress

## Core Features

- **User Authentication:** Secure login and registration system for students and academic staff with role-based access control.
- **Topic Management:** Creation, joining, and withdrawal from academic topics with capacity limits and status tracking.
- **Declaration Signing:** Digital signing of declarations related to academic processes and approvals.
- **Opinion Submission:** Submission and management of opinions on topics and assignments.
- **Assignment Handling:** Management of assignments linked to topics, including status updates and approvals.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ZPI-Website
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up --build
   ```

3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Usage

To run the application in development mode:

1. Ensure Docker Compose is running as described in Installation.

2. For frontend development (if running outside Docker):
   ```
   cd frontend
   npm install
   npm run dev
   ```

3. For backend development (if running outside Docker):
   ```
   cd backend
   npm install
   npm run dev
   ```

Example API call to get topics:
```
curl -X GET http://localhost:3001/api/topics
```

## Technical Details

### Project Structure

```
ZPI-Website/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seeder.js
│   │   └── migrations/
│   └── src/
│       ├── config.js
│       ├── server.js
│       ├── controllers/
│       ├── lib/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── config.js
│       ├── index.css
│       ├── main.jsx
│       ├── api/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       ├── providers/
│       └── public/
├── cypress/
│   ├── e2e/
│   └── screenshots/
├── docs/
│   └── api/
│   └── system/
├── docker-compose.yml
├── docker-compose.test.yml
├── package.json
└── jsdoc.json
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@host:port/dbname`)
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_DB`: PostgreSQL database name
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT tokens
- `REFRESH_TOKEN_SECRET`: Secret key for refresh tokens
- `ACCESS_TOKEN_SECRET`: Secret key for access tokens
- `FRONTEND_URL`: URL of the frontend application
- `VITE_BACKEND_URL`: Backend URL for Vite
- `BACKEND_PORT`: Port for the backend server
- `FRONTEND_PORT`: Port for the frontend server
- `POSTGRES_DB_TEST`: Test database name
- `POSTGRES_USER_TEST`: Test database username
- `POSTGRES_PASSWORD_TEST`: Test database password
- `DATABASE_URL_TEST`: Test database connection string
- `VITE_BACKEND_URL_TEST`: Test backend URL for Vite
- `FRONTEND_URL_TEST`: Test frontend URL
