// We import bcryptjs — this library hashes passwords.
// Hashing means converting "mypassword123" into a scrambled string
// like "$2a$10$abc...xyz" that cannot be reversed back.
// NEVER store plain passwords in a database — always hash them.
const bcrypt = require('bcryptjs');

// We import jsonwebtoken — this creates a JWT token.
// A JWT token is like a temporary ID card given to the user after login.
// Every request after login will carry this token so the server
// knows who is making the request — without asking for password again.
const jwt = require('jsonwebtoken');

// We import our User model — we need it to save and find users in MongoDB.
const User = require('../models/User');

// ─────────────────────────────────────────
// REGISTER
// This function runs when someone submits the registration form.
// ─────────────────────────────────────────
const register = async (req, res) => {
  // We use try/catch — if anything goes wrong (database error, etc.)
  // the catch block handles it gracefully instead of crashing the server.
  try {
    // req.body contains the data sent from the React form.
    // We extract name, email, password from it.
    const { name, email, password } = req.body;

    // Check if all fields are provided.
    // If any field is missing, we stop here and send an error back.
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if a user with this email already exists in the database.
    // We don't want two accounts with the same email.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving.
    // '10' is the salt rounds — higher = more secure but slower.
    // 10 is the industry standard — good balance of speed and security.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User document using our User model.
    // We pass the name, email, and the HASHED password — never the original.
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to MongoDB.
    // 'await' means we wait for the save to complete before moving on.
    await user.save();

    // Create a JWT token for the new user.
    // jwt.sign() takes:
    // 1. The payload — data we want to store inside the token (user id and role)
    // 2. The secret key — from our .env file, used to sign the token
    // 3. Options — expiresIn means the token expires after 7 days,
    //    forcing the user to log in again for security.
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send back a success response with the token and basic user info.
    // The frontend will store this token and use it for future requests.
    // We use 201 status — it means "Created" (a new resource was created).
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // If anything unexpected happens, we log it for debugging
    // and send a 500 status — meaning "Server Error".
    console.log('Register error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// LOGIN
// This function runs when someone submits the login form.
// ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Find the user in the database by email.
// If no user is found, findOne() returns null.
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password the user typed with the hashed password in the database.
    // bcrypt.compare() does this safely — returns true if they match.
    // We never "decrypt" the hash — bcrypt re-hashes and compares.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If password matches, create a new JWT token for this session.
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send back success response with token and user info.
    // Status 200 means "OK" — request was successful.
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// We export both functions so our routes file can use them.
module.exports = { register, login };