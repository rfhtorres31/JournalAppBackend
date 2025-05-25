const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/AuthController'); // import AuthController Function
const {verifyToken, logoutUser} = require('../controllers/TokenController'); // import verfiyTokenController Function


// Routes for Registration, Login and Logout
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);


// Routes for Token Management
router.get('/verify-token', verifyToken);


module.exports = router;
