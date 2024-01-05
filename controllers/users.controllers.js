const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword, role } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Username and password do not match'
            });
        }

        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.User.create({
            username,
            email,
            password: hashedPassword,
            role,
        });

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
            expiresIn: '1d'
        })

        res.status(201).json({
            status: true,
            message: 'User created successfully',
            data: { newUser, token }
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'Invalid email or password'
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            status: true,
            message: 'User logged in successfully',
            data: { user, token }
        });
    } catch (error) {
        next(error);
    }
};

const autenticate = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                status: false,
                message: 'Bad Request',
                error: 'User not authenticated'
            });
        }
        res.status(200).json({
            status: true,
            message: 'User authenticated successfully',
            data: { user }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login, getAllUsers, autenticate };
