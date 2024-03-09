import express from 'express';
import dotenv from 'dotenv';
import MovieRouter from './routes/MovieRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import AuthRouter from "./routes/AuthRoutes.js";
import db from './db/db.js';

import bodyParser from "body-parser"; // This is a middleware that will help us parse the request body

const app = express(); // Create an instance of an Express app

dotenv.config(); // Load environment variables

// Middleware
app.use(express.json()); // This will parse incoming request bodies in JSON format
app.use(bodyParser.json()); // This will parse incoming request bodies in JSON format

// Route Middlewares
// This will prefix all routes in MovieRouter with '/movies' (e.g. '/movies', '/movies/:id')
app.use('/movies', MovieRouter);
// This will prefix all routes in UserRouter with '/users' (e.g. '/users/:email', '/users/id/:id')
app.use('/users', UserRouter);
// This will prefix all routes in AuthRouter with '/auth' (e.g. '/auth/register', '/auth/login')
app.use('/auth', AuthRouter);

// PostgresSQL connection
db.connect() // Connect to the database
    .then(() => console.log('Connected to Postgresql')) // If the connection is successful, log a message
    .catch(err => console.error('Failed to connect to Postgresql', err)); // If the connection fails, log an error message

// Start the server
const port = process.env.PORT || 3000; // Use the PORT environment variable, or 3000 if it's not set
app.listen(port, () => console.log(`Server running on port ${port}`)); // Start the server and log a message
