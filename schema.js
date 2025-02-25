const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String], 
    default: ['user'],
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;