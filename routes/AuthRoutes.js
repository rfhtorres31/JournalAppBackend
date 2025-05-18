const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/AuthController'); // import AuthController Function
const verifyToken = require('../controllers/TokenController'); // import verfiyTokenController Function

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-token', verifyToken);


module.exports = router;
