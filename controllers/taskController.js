const jwt = require('jsonwebtoken');
const errResponse = require('../lib/errorResponse');
const succResponse = {...require('../lib/successResponse')};
const {PrismaClient} = require('../generated/prisma');

const prisma = new PrismaClient();


const addTask = async (req, res) => {
      
    try {
        const taskData = req.body;
        const {title, description, category, fromDate, toDate} = req.body; // This is already parsed as Javascript Object String 
        //console.log(taskData);

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


        const addTask = await prisma.task.create({
            data: {
              user_id: userID,
              title: title,
              description: description,
              from_date: new Date(fromDate),
              due_date: new Date(toDate), 
              category: category,
              isCompleted: false,
            },
        })

        //console.log(addTask);


        
        succResponse.message = "Task Object Received";
        succResponse.code = "Ok";
        succResponse.status = 200,
        succResponse.details = "Successful";
            
        // extract the tokenDetails property and the rest of the properties. 
        // This creates a new response object variable that doesn't include the token details property
        const {tokenDetails, content, ...response} = succResponse; 

        res.status(200).json(response);
    }
    catch (err) {
       console.error(err);
    }
    
};


const getTask = async (req, res) => {
    
    try {

        const userID = req.query.userID;

        if (!userID) {

            errResponse.message = "Bad Request";
            errResponse.code = "BAD REQUEST";
            errResponse.status = 400,
            errResponse.details = "no user id";

            return res.status(400).json(errResponse);
        }

        const tasks = await prisma.task.findMany({
            where: {
                user_id: userID,
            },
            select: {
               title: true,
               description: true,
               from_date: true,
               due_date: true,
               category: true,
               isCompleted: true,
            }, 
        });

        console.log(tasks.length);

        succResponse.message = "Add Tasks";
        succResponse.code = "Ok";
        succResponse.status = 200,
        succResponse.content = tasks,
        succResponse.details = "Successful";

        const {tokenDetails, ...response} = succResponse;

        return res.status(200).json(response);

    }
    catch (err) {
        console.error(err);
    }
    
}; 






module.exports = {
  addTask, 
  getTask,
}; 