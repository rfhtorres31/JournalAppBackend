require('dotenv').config();
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis'); 


// Verify Token Validity on Redis
const verifyTokenOnRedis = async (tokenID) => {
    
    if (!tokenID) {
        return false; 
    }

    const userID = await redisClient.get(`token:${tokenID}`); // retrieve value of userID from hash map
    
    if (userID === null){
        console.log("Token is not valid anymore");
        return false; // Token not found or expired
    }

    //console.log("Token is still valid");
    return true;
};


const verifyToken = async (req, res, next) => {
    
    const authorizationValue = req.headers.authorization; 

    if (!authorizationValue) {
        return res.status(401).json({message:"Bearer token is missing"});
    }

    const token = authorizationValue.split(' ')[1]; //Split the authorization value into two parts in an array then get the second element which is the token. 

    try {
        const decodedPayload = jwt.decode(token) // returns decoded payload. This is not a promised based /asynchronous function. It immediately returns the decoded payload
        const jwtID = decodedPayload?.jwtID; // If decodedPayload exist, get the decodedPayload.jwtID, if not, return undefined or null
        const isTokenValid = await verifyTokenOnRedis(jwtID);

        return isTokenValid ? res.status(200).json("Valid Token"): res.status(401).json("Invalid Token");
    }
    catch (err) {
        console.error(err);
    }
};


// Storing Token on Redis
const storeToken = async (tokenID, userID, ttlSeconds=3600) => {
  
   try {  
        if(!tokenID || !userID) {
            return {success: false, error: "Either Token ID or User ID is missing."};
        }   
                                           //key=token:${tokenID}, value=userID. It sets the key to expire to 900 seconds (TTL->Time to Live)
        const result = await redisClient.set(`token:${tokenID}`, userID, 'EX', ttlSeconds);

        if (result !="OK"){
          return {success: false, error: "There is an error during token storage"};
        }

        console.log(`Token stored for ${userID} with ${ttlSeconds}s expiration duration`);
        return {success: true};
   }
   catch (err) {
        console.error(err);
        return {success: false, error: err || "Unknown Error"};
   }
};


// Logout User, Token deletion from Redis 
const logoutUser = async function (req, res) {
     
    try {

      const authorizationValue = req.headers.authorization;

      if (!authorizationValue) {
          throw new Error("Bearer token is missing");
      } 

      const token = authorizationValue.split(' ')[1];
      const payload = jwt.decode(token);
      const tokenID = payload?.jwtID;
      
      const isTokenDeleted = await redisClient.del(`token:${tokenID}`);

      return isTokenDeleted === 1? res.status(200).json("Token deleted") : res.status(500).json("There is an error on token deletion");

    }
    catch (err) {
          console.error(err);
          return res.status(500).json(err);
    }
};


module.exports = {
    verifyToken,
    storeToken, 
    logoutUser
};
