const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require("jsonwebtoken");
const z = require("zod");
const mongoose = require("mongoose");
const User = require('../db');
const token = require('../config');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const db_url = process.env.DATABASE_URL;


// Connect to MongoDB
mongoose.connect(db_url)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("Connection to MongoDB failed:", err));

console.log(User);
// Validation schemas
const signupBody = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
});

const signinBody = z.object({
    email: z.string().email(),
    password: z.string(),
});

// Signup route  
router.post('/signup', async (req, res, next) => {
    try {
        // Validate request body
        const parsedBody = signupBody.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(411).json({ message: "Incorrect inputs" });
        }

        const { name, username, email, password } = req.body;

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: "User already exists. Please login." });
        }

        // Create and save the new user
        const newUser = new User({ name, username, email, password });
        await newUser.save();

        return res.status(201).json({ message: "User successfully created" });
    } catch (err) {
        next(err);
    }
});

// Signin route
router.post('/signin', async (req, res, next) => {
    try {
        // Validate request body
        const parsedBody = signinBody.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(411).json({ message: "Incorrect inputs" });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password
        const validPassword = await user.validatePassword(password);
        if (!validPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const userJWT = jwt.sign({
            useremail : email
        }, token);

        return res.status(200).json({ message: "User logged in successfully" , jwt_tokn: userJWT });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
