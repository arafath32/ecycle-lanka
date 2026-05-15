// express.Router() creates a mini router — a group of related routes.
// Instead of defining all routes in server.js (which gets messy),
// we group auth routes here and plug them into server.js as one block.
const express = require('express');
const router = express.Router();

// We import our controller functions — the actual logic lives there.
// The route just says "call this function when this URL is hit".
const { register, login } = require('../controllers/authController');

// POST /api/auth/register — when React sends registration form data here,
// call the register function from our controller.
// We use POST because we are SENDING data to create something new.
router.post('/register', register);

// POST /api/auth/login — when React sends login form data here,
// call the login function.
router.post('/login', login);

module.exports = router;