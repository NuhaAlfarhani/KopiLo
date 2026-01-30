import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // store user in database
        const newUser = await db.one(
            'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        console.log('ERROR:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login an existing user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            auth: true,
            token: token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.log('ERROR:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
};