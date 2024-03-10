import pkg from 'pg'; // Import the pg module
const { Pool } = pkg; // Destructure the Pool class from the pg module

const pool = new Pool({
    user: "victoriavavulina", // Replace with your own username
    host: "localhost", // Replace with your own host
    port: 5432, // Replace with your own port
    database: "movies", // Replace with your own database name
    password: "postgres" // Replace with your own password
});

export default pool;
