import db from '../db/db.js';

const UserController = {

    // Store a user in the database
    storeUserInDatabase: async (req, res) => {
        const {email, password} = req.body;
        const query = { // The query object is used to pass the SQL query and its parameters to the database
            text: 'INSERT INTO users (email, password) VALUES ($1, $2)',
            values: [email, password],
        }

        try {
            const result = await db.query(query);
            if (result.rowCount === 0) {
                // If the user was not added to the database, send a 500 Internal Server Error status code
                res.status(500).send({error: 'User not added to database'});
            } else { // If the user was added to the database, send a 201 Created status code
                res.status(201).send({message: 'User added to database'});
            }
        } catch (err) {
            console.error('Error executing query', err.stack);
            if (err.code === '23505') { // 23505 is the error code for a unique violation in PostgreSQL
                res.status(409).send({error: 'Duplicate entry', details: err.stack});
            } else { // If the error is not a unique violation, send a 500 Internal Server Error status code
                res.status(500).send({error: 'Database error', details: err.stack});
            }
        }
    },

    // Get users from the database by email
    getUserByEmail: async (email) => {
        const query = { // The query object is used to pass the SQL query and its parameters to the database
            text: 'SELECT * FROM users WHERE email = $1',
            values: [email],
        }

        try { // The try block is used to catch any errors that occur when executing the query
            const result = await db.query(query);
            if (result.rowCount === 0) {
                return null;
            } else { // If the query was successful, return the first row of the result
                return result.rows[0];
            }
        } catch (err) { // The catch block is used to handle any errors that occur when executing the query
            console.error('Error executing query', err.stack);
            throw err;
        }
    },

    // Delete a user from the database
    deleteUserByEmail: (req, res) => {
        const email = req.params.email;
        const query = { // The query object is used to pass the SQL query and its parameters to the database
            text: 'DELETE FROM users WHERE email = $1',
            values: [email],
        }

        // The query method is used to execute the SQL query
        db.query(query, (err, result) => {
            if (err) { // The if statement is used to check if an error occurred when executing the query
                console.error('Error executing query', err.stack);
                res.status(500, result).send({error: 'Database error'});
            } else { // If the query was successful, send a 200 OK status code
                res.sendStatus(200).end();
            }
        });
    },

    // Delete a user from the database by id
    deleteUserById: (req, res) => {
        const id = req.params.id;
        const query = { // The query object is used to pass the SQL query and its parameters to the database
            text: 'DELETE FROM users WHERE id = $1',
            values: [id],
        }

        // The query method is used to execute the SQL query
        db.query(query, (err, result) => {
            if (err) { // The if statement is used to check if an error occurred when executing the query
                console.error('Error executing query', err.stack);
                res.status(500, result).send({error: 'Database error'});
            } else { // If the query was successful, send a 200 OK status code
                res.sendStatus(200).end();
            }
        });
    }
}

export default UserController;
