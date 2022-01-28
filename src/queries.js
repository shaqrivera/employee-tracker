const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const cTable = require('console.table');

const db = mysql.createConnection(
   {
       host: process.env.SQL_host,
       user: process.env.SQL_user,
       password: process.env.SQL_password,
       database: process.env.SQL_db
   }
   )

const allDepartmentQuery = () => {
   db.query('SELECT * FROM department', (err,results)=>{
      console.table(results);
   });
};
const allRoleQuery = () => {
   db.query('SELECT * FROM role', (err,results)=>{
      console.table(results);
   });
};
const allEmployeeQuery = () => {
   db.query('SELECT * FROM employee', (err,results)=>{
      console.table(results);
   });
};

module.exports = {allDepartmentQuery, allRoleQuery, allEmployeeQuery};