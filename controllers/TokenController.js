require('dotenv').config();
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis'); 


// Verify Token Validity on Redis
const verifyTokenOnRedis = async (tokenID) => {

    const userID = await redisClient.get(`token:${tokenID}`); // retrieve value of userID from hash map
    
    if (userID === null){
        console.log("Token is not valid anymore");
        return false; // Token not found or expired
    }
    console.log("Token is still valid");
    return true;

};


const verifyToken = async (req, res, next) => {
    
    const authorizationValue = req.headers.authorization; 
    const token = authorizationValue.split(' ')[1]; //Split the authorization value into two parts in an array then get the second element which is the token. 

    try {
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY); // returns decoded payload
        const jwtID = decodedPayload.jwtID;
        const isTokenValid = await verifyTokenOnRedis(jwtID);

        if (isTokenValid) {
            return res.status(200).json("Valid Token");
        }
        else {
            return res.status(403).json("Invalid Token");
        }
    }
    catch (e) {
        return res.status(403).json("Invalid Token");
    }

};


// Storing Token on Redis
const storeToken = async (tokenID, userID, ttlSeconds=10)=> {
  
   try {                                     //key=token:${tokenID}, value=userID. It sets the key to expire to 900 seconds (TTL->Time to Live)
        const result = await redisClient.set(`token:${tokenID}`, userID, 'EX', ttlSeconds);

        if (result !="OK"){
          return false;
        }

        console.log(`Token stored for ${userID} with ${ttlSeconds}s expiration duration`);
        return true;
   }
   catch (err){
        return false; 
   }


};




module.exports = {
    verifyToken,
    verifyTokenOnRedis,
    storeToken, 
};
