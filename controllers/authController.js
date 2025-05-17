require('dotenv').config();  
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { v4: uuidv4 } = require('uuid');
const secret_key = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');

// Register
exports.register = async (req, res) => {
  const { email, password, name,  } = req.body;
   const id = uuidv4();
  try {
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({  id, email, passwordString : password, passwordHash: hashedPassword, name, isVerified: false });
    const token = jwt.sign({ email }, secret_key, { expiresIn: '1d' });

  // buat transport email
 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  const verificationUrl = `http://localhost:3000/verify?token=${token}`; // Next.js page

  await transporter.sendMail({
    to: email,
    subject: 'Email Verification',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333;">Welcome to Habit Tracker!</h2>
      <p style="font-size: 16px; color: #555;">
        Thank you for registering. Please verify your email address to activate your account.
      </p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
          style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Verify Email
        </a>
      </p>
      <p style="font-size: 14px; color: #999;">
        If you didn’t create an account, you can safely ignore this email.
      </p>
    </div>
  `,
  });

  res.json({ message: 'Verification email sent' });
    // res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
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


exports.verifyEmail = async (req, res) => {
  try {
    // console.log(req.body);
    const { token } = req.body;
    const decoded = jwt.verify(token, secret_key);
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}