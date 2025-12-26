# ZPI Website Frontend

A React-based frontend for the ZPI (Project Implementation) management system with passwordless authentication.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:3001`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the frontend root directory:
   ```bash
   VITE_BACKEND_URL=http://localhost:3001
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Check the browser console for environment variable debugging information

## Environment Variables

Vite uses environment variables that start with `VITE_` prefix. The `.env` file should be in the frontend root directory:

```bash
# Frontend .env file
VITE_BACKEND_URL=http://localhost:3001
```

### Troubleshooting Environment Variables

If `VITE_BACKEND_URL` is undefined:

1. **Restart the dev server** after creating/modifying `.env`
2. **Check file location**: `.env` should be in the `frontend/` directory
3. **Check variable name**: Must start with `VITE_`
4. **Check console**: Open browser dev tools to see debug logs
5. **No spaces**: Variable format should be `KEY=value` with no spaces around `=`

## Demo Users

The application loads users from the backend database. Select any user from the list to log in (no password required).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
