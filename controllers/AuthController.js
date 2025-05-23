const User = require('../models/User');
const bcrypt = require('bcrypt');
const {PrismaClient} = require('../generated/prisma');
// spread operator is a copy operator
// in this case, it creates a clone/copy of the error and success response object 
const errResponse = {...require('../lib/errorResponse')}; // to ensure a fresh copy of errorResponse object and to avoid mutation when used to other parts of the app
const succResponse = {...require('../lib/successResponse')}; // to ensure a fresh copy of successResponse object and to avoid mutation when used to other parts of the app
const generateToken = require('../utils/tokenGeneration');


const prisma = new PrismaClient();


//==================== User Registration ==============================//
const registerUser =  async function (req, res) {
  
   const saltRound = 10;
   const hashedPassword = await bcrypt.hash(req.body.password, saltRound);
   console.log(req.body);

   
   //==== User creation in PostGreSQL ====//
   try {
      
     //======== Check if username already exist =========//
      const isUsernameExist = await prisma.user.findFirst({where:{username: req.body.username}}) !== null; 
   
      //=========Check if email already exist ===========//
      const isEmailExist = await prisma.user.findFirst({ where:{ email: req.body.email}}) !== null; 

      if (isEmailExist) {

          errResponse.message = "Conflict";
          errResponse.code = "CONFLICT";
          errResponse.status = 409,
          errResponse.details = "Email is already taken";

          return res.status(409).json(errResponse);
      }
  
      else if (isUsernameExist) {

          errResponse.message = "Conflict";
          errResponse.code = "CONFLICT";
          errResponse.status = 409,
          errResponse.details = "Username is already taken";

          return res.status(409).json(errResponse);
      }

       await prisma.User.create({            
         data: {
            name: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
         },
       });
       
       succResponse.message = "User Created";
       succResponse.code = "CREATED";
       succResponse.status = 201,
       succResponse.details = "Successful Registration";

       return res.status(201).json(succResponse)
   }
   catch (error) {
       
        console.log(error);
        errResponse.message = "Internal Server Error";
        errResponse.code = "INTERNAL_SERVER_ERROR";
        errResponse.status = 500,
        errResponse.details = "Internal Server Error";

        return res.status(500).json(errResponse);
   }  
};
//================ End of User Registration =====================//

 //==== Function that checks if Login Input is Email or Username ====//
const getUserRecord = async (loginInput) => {

     return loginInput.includes('@') ? 
     await prisma.user.findFirst({ where: { email: loginInput}}) : 
     await prisma.user.findFirst({ where: { username: loginInput}});

};

//=================== User Login/Authentication ========================//
const loginUser =  async function (req, res) {

      //==== Check if user password and hashed password is match ====//
      try {
        
         const userRecord = await getUserRecord(req.body.loginInput);
         console.log(userRecord);
         if (!userRecord) {
              
            errResponse.message = "User not found";
            errResponse.code = "USER_NOT_FOUND";
            errResponse.status = 404,
            errResponse.details = "User doesn't exist";

            return res.status(404).json(errResponse);
         }
            
         const isPasswordMatch = await bcrypt.compare(req.body.password, userRecord.password);

         if (!isPasswordMatch) {
                
            errResponse.message = "Unauthorized";
            errResponse.code = "UNAUTHORIZED";
            errResponse.status = 401,
            errResponse.details = "Password doesnt match";

            return res.status(401).json(errResponse);
         }
         
         const payload = {id:userRecord.id.toString(), name:userRecord.name};
         const token = await generateToken(payload);
         
         const responseDetails = {message:"Login Successful", username:userRecord.username}

         succResponse.message = "Ok";
         succResponse.code = "OK";
         succResponse.status = 200,
         succResponse.details = responseDetails;
         succResponse.token = token;

         return res.status(200).json(succResponse);     
          
     }
     catch (error) {
       
         console.log(error);
         errResponse.message = "Internal Server Error";
         errResponse.code = "INTERNAL_SERVER_ERROR";
         errResponse.status = 500,
         errResponse.details = "Internal Server Error";

         return res.status(500).json(errResponse);
     }
  
 };
//============== End of User Authentication ========================//

module.exports = {
    registerUser,
    loginUser
};

