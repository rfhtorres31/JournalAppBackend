const jwt = require('jsonwebtoken');  
const {promisify} = require('util'); 
const crypto = require('crypto');

const signJWT = promisify(jwt.sign); // converts the jwt.sign function to a promised based so that asynchronous operation can be implemented
const secretKey = crypto.randomBytes(64).toString('hex');

const generateToken = async (payload) => {
     

     const token = await signJWT(payload, secretKey, {expiresIn: '1h'});

     return token;
};


module.exports = generateToken;