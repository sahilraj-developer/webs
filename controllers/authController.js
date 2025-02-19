const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Joi = require('joi');
require('dotenv').config();

// Validation schema
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Register API
exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, password } = req.body;

    try {
        // Check if user already exists using aggregation
        const existingUser = await User.aggregate([
            { $match: { email } },
            { $limit: 1 }
        ]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login API
exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { email, password } = req.body;

    try {
        // Find user using aggregation
        const user = await User.aggregate([
            { $match: { email } },
            { $limit: 1 },
            {
                $project: {
                    _id: 1,
                    password: 1 // Only return necessary fields
                }
            }
        ]);

        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const foundUser = user[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
