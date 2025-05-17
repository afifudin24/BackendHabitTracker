const express = require('express');
const auth = require('../middleware/auth');
const ac = require('../controllers/authController');
const router = express.Router();
// buat routes

router.post('/login', ac.login);
router.post('/register', ac.register);
router.post('/verify-email', ac.verifyEmail);

module.exports = router;