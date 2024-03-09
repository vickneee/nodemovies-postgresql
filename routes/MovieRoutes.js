import express from 'express';
import MovieController from '../controllers/MovieController.js';
import auth from '../services/Authenticate.js';

const router = express.Router(); // Create a new router

// Route Middlewares
// This will prefix all routes in MovieRouter with '/movies' (e.g. '/movies', '/movies/:id')
// app.use('/movies', MovieRouter);

// Define routes for Movie also authenticate the routes
router.post("/", auth.authenticate, MovieController.addMovie);
router.get('/', auth.authenticate, MovieController.getAllMovies);
router.get('/:id', auth.authenticate, MovieController.getMovieById);
router.put("/:id", auth.authenticate, MovieController.updateMovieById);
router.delete("/:id", auth.authenticate, MovieController.deleteMovieById);

export default router;
