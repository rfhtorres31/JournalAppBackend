const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/AuthController'); // import AuthController Function
const {verifyToken} = require('../controllers/TokenController'); // import verfiyTokenController Function
const {verifyTokenOnRedis} = require('../controllers/TokenController');

// Routes for Registration and Login
router.post('/register', registerUser);
router.post('/login', loginUser);


// Routes for Token Management
router.get('/verify-token', verifyToken);
router.get('/verify-token-redis', verifyTokenOnRedis);


module.exports = router;
