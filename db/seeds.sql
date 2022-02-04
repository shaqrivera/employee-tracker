INSERT INTO department (name) VALUES ('Sales'),('Accounting'),('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES ('Salesman',50000,1),('Sales Manager',90000,1),
('Accountant',75000,2),('Accounting Manager', 150000,2),('Recruiter',45000,3),('HR Director',85000,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Scott', 'Mescudi', 2, NULL),('Albert', 'Einstein', 1, 1),
('Jennifer','Lopez',4,NULL),('Brad','Pitt',3,3),('Dwayne','Carter',6,NULL),('Travis','Scott',5,5);