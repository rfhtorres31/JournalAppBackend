const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/AuthController'); // import AuthController Function
const {verifyToken, logoutUser} = require('../controllers/TokenController'); // import verfiyTokenController Function
const {taskController} = require('../controllers/taskController'); 

// Routes for Registration, Login and Logout
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/logout', logoutUser);


// Routes for Token Management
router.get('/auth/verify-token', verifyToken);


// Routes for Task Management
router.post('/task', taskController);


module.exports = router;
