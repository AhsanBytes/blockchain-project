const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Nasha@125#',
  database: 'project',
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;