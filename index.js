const inquirer = require('inquirer');
const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const cTable = require('console.table');
const {allDepartmentQuery, allRoleQuery, allEmployeeQuery }= require('./src/queries.js');
const { restoreDefaultPrompts } = require('inquirer');
const db = mysql.createConnection(
{
    host: process.env.SQL_host,
    user: process.env.SQL_user,
    password: process.env.SQL_password,
    database: process.env.SQL_db
},
console.log(`Connected to the ${process.env.SQL_db} database.`)
)

const question = [
    {
        type: 'list',
        name: 'initial',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles',
         'View all employees', 'Add a department', 'Add a role',
        'Add an employee', 'Update an employee role']
    },

];

const nextQuestion = [
    {
        type: 'confirm',
        name: 'next',
        message: 'Would you like to continue?',
        default: true

    }
];

const initialPrompt = async () => {
   let choice= await inquirer.prompt(question);
    
    if (choice.initial === 'View all departments'){
         allDepartmentQuery();
    }
    else if (choice.initial === 'View all roles'){
         allRoleQuery();
    }
    else if (choice.initial === 'View all employees'){
         allEmployeeQuery();
    }
    nextPrompt();
};

const nextPrompt = async () => {
    let choice = await inquirer.prompt(nextQuestion);
    if(choice.next === true){
        initialPrompt();
    }
    else{
        process.exit();
    }
};

initialPrompt();
