const jwt = require('jsonwebtoken');
const errResponse = require('../lib/errorResponse');
const succResponse = {...require('../lib/successResponse')};
const {PrismaClient} = require('../generated/prisma');

const prisma = new PrismaClient();


const taskController = async (req, res) => {
      
    try {
        const {title, description, category, fromDate, toDate} = req.body;
        console.log(taskData);

        if (!taskData) {
            errResponse.message = "Bad Request";
            errResponse.code = "BAD REQUEST";
            errResponse.status = 400,
            errResponse.details = "No data Received";
            
            res.status(400).json(errResponse);     
        } 
        
        const authorizationValue = req.headers.authorization; 
        const token = authorizationValue.split(' ')[1];
        const payload = jwt.decode(token);
        const userID = BigInt(payload?.id);

        // const addTask = await prisma.task.create({
        //     data: {
        //       user_id: userID,
        //       title: title,
        //       description: description, 

        //     },
        // })
        console.log(payload);
        console.log(userID);


        
        succResponse.message = "Task Object Received";
        succResponse.code = "Ok";
        succResponse.status = 200,
        succResponse.details = "Successful";
            
        // extract the tokenDetails property and the rest of the properties. 
        // This creates a new response object variable that doesn't include the token details property
        const {tokenDetails, ...response} = succResponse; 

        res.status(200).json(response);
    }
    catch (err) {
       console.error(err);
    }
    


};





module.exports = {taskController}; 