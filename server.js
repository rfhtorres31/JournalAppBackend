require('dotenv').config();
const app = require('./app');
const seqInstance = require('./config/Sequelize');

const port = process.env.PORT || 8080; 


app.get('/db-status', async (req,res) => {
   
  const status = await seqInstance.authenticate();
   try {      
     
     console.log(status);
     res.status(200).json("Sequelize Authenticate Successfully");
   }
   catch (error) {
      console.error(status);
      await res.status(500).json("Sequelize Authenticate Error");
   }      
});

app.listen(port, ()=>{
  //console.log(`Server is running on port ${port} in ${process.env.NODE_ENV}`);
});

