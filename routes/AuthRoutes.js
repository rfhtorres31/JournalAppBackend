const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController'); //->import AuthController Function


router.post('/register', AuthController.RegisterController);
router.post('/login', AuthController.LoginController);


module.exports = router;
