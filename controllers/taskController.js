const jwt = require('jsonwebtoken');
const errResponse = require('../lib/errorResponse');
const succResponse = {...require('../lib/successResponse')};
const {PrismaClient} = require('../generated/prisma');
const { response } = require('express');

const prisma = new PrismaClient();

const addTask = async (req, res) => {
      
    try {

        const taskData = req.body;
        console.log(taskData);
        const hasEmptyValues = Object.values(taskData).every(value => value === '');
        
        // This checks if  data from task data JSON are all empty
        if (hasEmptyValues) {
                                 
            errResponse.message = "Bad Request";
            errResponse.code = "BAD REQUEST";
            errResponse.status = 400,
            errResponse.details = "No data Received";
        
            res.status(400).json(errResponse); 
            return;    
        } 





        // This is already parsed as Javascript Object String
        const {title, description, category, fromDate, toDate, subTask} = req.body;  
        const authorizationValue = req.headers.authorization; 
        const token = authorizationValue.split(' ')[1];
        const payload = jwt.decode(token);
        const subTaskArr = subTask;

        console.log(subTaskArr);
        const userID = BigInt(payload?.id);

        const taskObj = await prisma.task.create({
            data: {
              user_id: userID,
              title: title,
              description: description,
              due_date: new Date(toDate), 
              category: category,
              isCompleted: false,
            },
        })
    
        // Check if the subarray task has content
        if (taskData.subTask.length > 0) {
            
            const subTaskArr = taskData.subTask; 

            for (let i = 0; i<subTaskArr.length; i++){

                const subTask = subTaskArr[i];
                
                await prisma.subTask.create({
                      data: {
                         user_id: userID,
                         task_id: taskObj.id,
                         isCompleted: false,
                         sub_task: subTask,
                      }
                })
            }
        }

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
               id: true,
               title: true,
               description: true,
               due_date: true,
               category: true,
               isCompleted: true,
            }, 
        });

        const safeTasks = tasks.map(task=>({...task, id:task.id.toString()}));

        //console.log(tasks.length);

        succResponse.message = "Task added successfully";
        succResponse.code = "Ok";
        succResponse.status = 200,
        succResponse.content = {"tasks": safeTasks, },
        succResponse.details = "Successful";

        const {tokenDetails, ...response} = succResponse;

        return res.status(200).json(response);

    }
    catch (err) {
        console.error(err);
    }
    
}; 


const deleteTask = async (req, res) => {
     
     try {
          const taskID = req.query.taskID;
          const userID = req.query.userID;

          if (!taskID) {
           errResponse.message = "Bad Request";
           errResponse.code = "BAD REQUEST";
           errResponse.status = 400,
           errResponse.details = "no task id";

           return res.status(400).json(errResponse);
          }

          await prisma.subTask.deleteMany({
            where: {
                task_id: BigInt(taskID),
            }
          })

          await prisma.task.delete({
            where: {
                id: BigInt(taskID),
                user_id: BigInt(userID)
            }
          })

        succResponse.message = "Task deleted successfully";
        succResponse.code = "Ok";
        succResponse.status = 200,
        succResponse.details = "Successful";

        const {tokenDetails, content, ...response} = succResponse;

        return res.status(200).json(response);
     }
     catch (err) {
       console.error(err);
     }



};


module.exports = {
  addTask, 
  getTask,
  deleteTask,
}; 