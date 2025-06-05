const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController'); // import AuthController Function
const {verifyToken, logoutUser} = require('../controllers/tokenController'); // import verfiyTokenController Function
const {addTask, getTask} = require('../controllers/taskController'); 

// Routes for Registration, Login and Logout
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/logout', logoutUser);


// Routes for Token Verification
router.get('/auth/verify-token', verifyToken);


// Routes for Task Management
router.post('/add-task', addTask);
router.get('/get-task', getTask);



module.exports = router;
