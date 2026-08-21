# Haqtri MVP Build Log

## Step 1: Initialize Project
- Created root folder `haqtri-mvp/`
- Initialized Git repository
- Added `backend/` folder
  - Installed dependencies: express, cors, dotenv, mongoose, jsonwebtoken, bcryptjs
  - Installed dev dependency: nodemon
  - Created `app.js` (Express app setup with CORS + JSON middleware)
  - Created `server.js` (entry point, loads `.env`, runs server on PORT 5000)
  - Created `.env` with PORT, MONGO_URI, JWT_SECRET
- Added `frontend/` using `create-react-app`
- Added `PROJECT_PROGRESS.md` to track progress

✅ Backend and frontend are now bootstrapped.

## Step 2: User Authentication Setup
- Created `models/User.js` with password hashing & compare methods
- Created `controllers/authController.js` with register + login endpoints
- Created `middleware/auth.js` for JWT-based route protection
- Created `routes/auth.js` with `/register` and `/login`
- Updated `app.js` to use `/api/auth` routes and connect to MongoDB

✅ User authentication system in place. Supports:
- POST `/api/auth/register`
- POST `/api/auth/login`
