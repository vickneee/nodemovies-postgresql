import express from 'express';
import UserController from '../controllers/UserController.js';
import auth from '../services/Authenticate.js';

const router = express.Router(); // Create a new router

// Route Middlewares
// This will prefix all routes in UserRouter with '/users' (e.g. '/users/:email', '/users/id/:id')
// app.use('/users', UserRouter);

// Route for user deletion
router.delete("/:email", auth.authenticate, UserController.deleteUserByEmail);
router.delete("/id/:id", auth.authenticate, UserController.deleteUserById);

export default router;
