require('dotenv').config();  
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { v4: uuidv4 } = require('uuid');
const secret_key = process.env.SECRET_KEY;

// Register
exports.register = async (req, res) => {
  const { email, password, name,  } = req.body;
   const id = uuidv4();
  try {
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({ email, passwordString : password, passwordHash: hashedPassword, name });

    res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log(user.passwordHash);
    console.log(password);
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, name : user.name }, secret_key, { expiresIn: '1d' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};