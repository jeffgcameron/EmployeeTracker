use EmployeeTracker;

INSERT INTO department
    (name)
VALUES
    ('Management'),
    ('Reception')
    ('Accounting'),
    ('Engineering'),
    ('Sales'),
    ('Human Resources'),
    ('Warehouse');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Regional Manager', 200000, 1),
    ('Assistant to the RM', 75000, 1),
    ('Receptionist', 100000, 2),
    ('Accounting Lead', 11500, 3),
    ('Accountant', 85000, 3),
    ('Lead Engineer', 150000, 4),
    ('Software Engineer', 125000, 4),
    ('Sales Lead', 150000, 5),
    ('Salesperson', 90000, 5),
    ('Human Resources Manager', 200000, 6);
    ('Lawyer', 150000, 7);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Micheal', 'Scott', 1, NULL),
    ('Dwight', 'Schrute', 2, 1),
    ('Pam', 'Beasley', 3, 1),
    ('Kevin', 'Malone', 4, 1),
    ('Oscar', 'Martinez', 5, 4),
    ('Jeff', 'Cameron', 6, 1),
    ('Jim', 'Halpert', 8, NULL),
    ('Stanley', 'Hudson', 9, 7);
    
