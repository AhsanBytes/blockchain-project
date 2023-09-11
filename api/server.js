// 0xf30340148c22f07e5da8abb7e3b63af90e9ea346

const express = require('express');
const cron = require('node-cron');
const cors = require('cors');

const app = express();
const { get_Name, get_Token, get_ID, get_Desc, get_balance,get_all} = require('./controller/index');
const {fetchDataAndStore} = require('./cron-job');

cron.schedule('* * * * *', () => {
    console.log('Fetching data and updating database...');
    fetchDataAndStore();
  });

  process.on('exit', () => {
    pool.end();
    console.log('Cron job stopped.');
  });
//user-/api/ethereum/create-task -> server.js -> routes.js -> controller.js -> tasks.js
app.use(cors());
// app.use(express.json())
// app.use('/api/ethereum',tasks)

app.get("/api/get_Name", get_Name);
app.get("/api/get_TokenName", get_Token);
app.get("/api/get_ID", get_ID);  
app.get("/api/get_Desc", get_Desc);
app.get("/api/get_balance", get_balance);
app.get("/api/get_all", get_all);


const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server Running At PORT ${PORT}`)
})