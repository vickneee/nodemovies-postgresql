import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserController from "../controllers/UserController.js";

// User creation
const createUser = async (req, res) => {
    // Extract user details from the request body
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password are provided
    if (!email || !password) {
        console.log('Email or password not provided');
        return res.sendStatus(400).end();
    }

    try { // Check if the user already exists
        const existingUser = await UserController.getUserByEmail(email);
        if (existingUser) {
            console.log('User already exists');
            return res.status(409).send({error: 'User already exists'});
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        // Replace plain password with hashed password
        req.body.password = bcrypt.hashSync(password, salt);
        // Store the user in the database
        await UserController.storeUserInDatabase(req, res);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send({error: 'Database error', details: err.stack});
    }
}

// User login
const login = async (req, res) => {
    // Extract email and password from the request body
    const email = req.body.email;
    const password = req.body.password;

    // Check if email and password are provided
    if (!email || !password) {
        console.log('Email or password not provided');
        return res.sendStatus(400).end();
    }

    try { // Check if the user exists
        const user = await UserController.getUserByEmail(email);
        if (user) {
            const hash = user.password;
            // Create JSON Web Token
            const token = jwt.sign({userId: email}, process.env.SECRET_KEY);

            // If password match, send the token
            if (bcrypt.compareSync(password, hash))
                res.send({token, message: 'You are logged in'});
            else {
                console.log('Password does not match');
                res.sendStatus(400).end();
            }
        } else { // If a user does not exist, send a 400 status code
            console.log('User not found');
            res.sendStatus(400).end();
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send({error: 'Database error', details: err.stack});
    }
}

// User authentication
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if the Authorization header is provided
    if (!authHeader) {
        console.log('Authorization header not provided');
        return res.sendStatus(400).end();
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header

    // console.log('Token:', token); // Log the token for debugging

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => { // Use the correct secret key

        // console.log('JWT verify error:', err);  // Log the JWT verify error for debugging
        // console.log('JWT verify decoded:', decoded); // Log the JWT verify decoded token for debugging

        if (err) {  // If the token is not successfully verified
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        }

        // If the token is successfully verified
        req.userId = decoded.userId; // Use the correct property from the decoded token
        next();
    });
}

export default {
    authenticate,
    login,
    createUser
}
