const Redis = require('ioredis');  // Imports Redis Class
const redisClient = new Redis('redis://localhost:6379'); // create a Redis Class Instance client  




redisClient.on('connection', ()=>console.log('Connected to Redis'));
redisClient.on('error', (err)=>console.error('Error connecting to redis', err));



module.exports = redisClient;