require('dotenv').config();
const jwt = require('jsonwebtoken');


const verifyToken = async (req, res, next) => {
   
    
    
    const authorizationValue = req.headers.authorization; 
    const token = authorizationValue.split(' ')[1]; //Split the authorization value into two parts in an array then get the second element which is the token. 
    
    if (!token) {
        return res.status(403).json("Token is invalid");
    }

    try {
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY); // returns decoded payload
    }
    catch (e) {
        return res.status(403).json("Token is invalid");
    }

    

};



module.exports = verifyToken;
