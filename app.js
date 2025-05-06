const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes');
const app = express(); 


// Security Middleware/s
//-- CORS 
const corsOptions = {
   origin: '*', // Allow all domain URLS to access the backend, Change this to specific URL/domain during production
   methods: ['GET','POST','PUT','DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // These are the allowed headers from the frontend API Request
   credentials: true, 
};

app.use(cors(corsOptions));


// Body Parsing 
// It reads/analyze and deserialize the data from the incoming request 
app.use(express.json()); 


//Routing
app.get('/', function(req,res){
    res.json({message:"Server is running"});
});


app.use('/api/auth/', authRoutes);





module.exports = app;