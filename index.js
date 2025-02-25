const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./schema');
const dotenv = require('dotenv');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json()); 




dotenv.config();
mongoose.connect( 'mongodb://127.0.0.1:27017/blogDB')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, roles, firstName, lastName, age } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
      roles: roles || ['user'], // Default role is 'user'
      profile: { firstName, lastName, age },
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from response
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});