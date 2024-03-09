import express from 'express';
import auth from '../services/Authenticate.js';

const router = express.Router(); // Create a new router

// Route Middlewares
// This will prefix all routes in AuthRouter with '/auth' (e.g. '/auth/register', '/auth/login')
// app.use('/auth', AuthRouter);

// Route for user creation
router.post("/register", auth.createUser);

// Route for login
router.post("/login", auth.login);

export default router;
