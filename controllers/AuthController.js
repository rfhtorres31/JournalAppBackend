const User = require('../models/User');
const bcrypt = require('bcrypt');


const RegisterController =  async function (req, res) {
   
   const saltRound = 10;
   const hashedPassword = await bcrypt.hash(req.body.password, saltRound);

   const isUsernameExist = await User.findOne({
       where:{
          username: req.body.username,
       }       
   }); 

   const isEmailExist = await User.findOne({
    where:{
       email: req.body.email,
    }       
   }); 
     
   // User creation
   try {
      
      console.log(req.body);
      if (isEmailExist) {
        return res.status(409).json("Email already exist");
      }

      if (isUsernameExist) {
        return res.status(409).json("Username already exist");
      }

      await User.create({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        encryptedPassword: hashedPassword,
      });
       return res.status(200).json("User creation successful")
   }
   catch (error) {
      return res.status(500).json(error);
   }

   
};











const LoginController =  async function (req, res) {

    console.log(req.body);
 
 
 };


module.exports = {
    RegisterController,
    LoginController
};