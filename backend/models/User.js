// We import mongoose — we need it to create a model.
// A model is a class that represents a collection in MongoDB.
const mongoose = require('mongoose');

// A 'Schema' defines the structure of a document in MongoDB.
// Think of it like designing a form — what fields exist, what type they are,
// and what rules they must follow.
const userSchema = new mongoose.Schema(
  {
    // 'name' field — must be text (String), and it's required.
    // If someone tries to register without a name, MongoDB will reject it.
    name: {
      type: String,
      required: true,
      trim: true, // automatically removes extra spaces before/after the name
    },

    // 'email' field — must be text, required, and unique.
    // 'unique: true' means no two users can have the same email.
    // This prevents duplicate accounts.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // automatically converts to lowercase before saving
      trim: true,
    },

    // 'password' field — we will NEVER store the real password.
    // bcryptjs will convert it to a hashed string before saving.
    // Example: "mypassword123" becomes "$2a$10$Xk9...random characters"
    password: {
      type: String,
      required: true,
    },

    // 'role' field — this decides what the user can do in the system.
    // 'user' = normal buyer/seller
    // 'admin' = can manage all listings and users
    // 'enum' means only these exact values are allowed — nothing else.
    // 'default' means if no role is given, it automatically becomes 'user'.
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // 'profileImage' — stores the filename of the user's profile picture.
    // We don't store the image itself in MongoDB (that would be too heavy).
    // We store just the filename, and the actual image sits in the uploads folder.
    profileImage: {
      type: String,
      default: '', // empty by default — user may not upload a photo
    },
  },

  {
    // 'timestamps: true' automatically adds two fields to every document:
    // 'createdAt' — when the user registered
    // 'updatedAt' — when the user last updated their profile
    // We don't have to manually set these — mongoose handles it.
    timestamps: true,
  }
);

// We create the actual Model from the schema.
// 'User' is the model name — mongoose will automatically create
// a collection called 'users' (lowercase + plural) in MongoDB.
const User = mongoose.model('User', userSchema);

// We export the User model so other files (like our routes) can use it.
module.exports = User;