const mysql= require("mysql");
require('dotenv').config();
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database:process.env.DB_NAME
  });
//Connection to The Db 
  conn.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('DB CONNECTED');
  });

  module.exports = conn;