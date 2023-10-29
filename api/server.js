const express = require('express');
const cors = require('cors');
const { Cron } = require('./cron-job');
const tasks = require('./routes/index.js')
const app = express();

app.use(express.json());
Cron();
app.use(cors());
app.use('/api', tasks);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Running At PORT ${PORT}`)
})
//user-/api/update-name -> server.js -> routes.js -> controller.js -> index.js