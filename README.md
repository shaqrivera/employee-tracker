![license badge](https://img.shields.io/badge/license-MIT_License-blue)

# Who Works for Who

## Description

A simple node.js application utilizing inquirer.js and mysql2.js to keep track of departments and employees.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)
- [License](#license)

## Installation

First install Node.js, and MySQL (<a href="https://nodejs.org/en/download/" target="_blank">Link to install Node.js</a>) (<a href="https://www.mysql.com/downloads/" target="_blank">Link to install MySQL</a>) Install the required dependencies using 'npm i'. Next, you must run the schema.sql file in order to create the database. In the root directory of the repository, use the following two commands in order (The second command may be omitted if test seeds are not desired.) :

First command: `source ./db/schema.sql;`

Second command (optional seeds): `source ./db/seeds.sql;`

You must also rename the file named 'variables.env' to '.env'. Inside that file, you must insert your MySQL user name into the variable 'SQL_user'. You must also insert your MySQL password into the variable SQL_password. Ensure that 'localhost' is the correct MySQL host name for your environment.

That's it! You're all set to run Who Works for Who.

## Usage

Once the required dependencies are installed, simply use the terminal command 'node index.js' in the main directory to initialize Who Works for Who. <a href="https://drive.google.com/file/d/1mpIj_pAammg3jzLRo6UIG74jExcF5iRI/view?usp=sharing" target="_blank">Link to instructional video</a>

## Contributing

Anybody can use this application, and modify it.

## Tests

After seeding the database and initializing the application, choose the option "View all departments". In your console, you should see a formatted table containing Sales, Accounting, and Human Resources.

## Questions

Github username : <a href="https://github.com/shaqrivera">shaqrivera</a>

If you have any questions, please submit inquiries to <a href="mailto:shaq.rivera@gmail.com">shaq.rivera@gmail.com</a>.

## License

This project is using the MIT License. For more information, refer to following link.
[MIT License](https://spdx.org/licenses/MIT.htm)

---
