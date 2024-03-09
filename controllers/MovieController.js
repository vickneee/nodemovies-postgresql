import express from 'express';
import db from '../db/db.js';

const app = express(); // Create an instance of an Express app
app.use(express.json()); // This middleware will allow us to parse JSON requests

const MovieController = {

    // ADD a new movie
    addMovie: async (req, res) => {
        const { title, director, year } = req.body;
        try { // Try to execute the query
            await db.query('INSERT INTO movies (title, director, year) VALUES ($1, $2, $3)', [title, director, year]);
            res.status(201).json({ message: "Movie created successfully" });
        } catch (error) {  // If an error occurs, log it and send a 500 status code
            console.error("Error creating movie:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // GET all movies
    getAllMovies: async (req, res) => {
        try { // Try to execute the query
            const result = await db.query('SELECT * FROM movies');
            res.json(result.rows);
        } catch (error) { // If an error occurs, log it and send a 500 status code
            console.error("Error fetching movies:", error);
            res.status(500).json({message: "Internal server error"});
        }
    },

    // GET movie by id
    getMovieById: async (req, res) => {
        const query = { // Create a query object with the SQL query and the values to be interpolated
            text: 'SELECT * FROM movies WHERE id = $1',
            values: [req.params.id],
        }

        try { // Try to execute the query
            const result = await db.query(query);
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else { // If no movie is found, send a 404 status code
                res.status(404).json({ message: "Movie not found" });
            }
        } catch (error) { // If an error occurs, log it and send a 500 status code
            console.error('Error executing query', error.stack);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // UPDATE movie by id
    updateMovieById: async (req, res) => {
        const { id } = req.params;
        const { title, director, year } = req.body;
        const query = { // Create a query object with the SQL query and the values to be interpolated
            text: 'UPDATE movies SET title = $1, director = $2, year = $3 WHERE id = $4',
            values: [title, director, year, id],
        }

        try { // Try to execute the query
            await db.query(query);
            res.json({ message: "Movie updated successfully" });
        } catch (error) { // If an error occurs, log it and send a 500 status code
            console.error("Error updating movie:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // DELETE movie by id
    deleteMovieById: async (req, res) => {
        const { id } = req.params;
        const query = { // Create a query object with the SQL query and the values to be interpolated
            text: 'DELETE FROM movies WHERE id = $1',
            values: [id],
        }

        try { // Try to execute the query
            await db.query(query);
            res.json({ message: "Movie deleted successfully" });
        } catch (error) { // If an error occurs, log it and send a 500 status code
            console.error("Error deleting movie:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

};
export default MovieController;
