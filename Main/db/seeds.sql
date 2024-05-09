-- Insert sample data into the department table
INSERT INTO department (name)
VALUES
  ('Pro Shop'),
  ('Grounds Keeper'),
  ('Snack Bar'),
  ('Human Resources');

-- Insert sample data into the role table
INSERT INTO role (title, salary, department_id)
VALUES
  ('Pro Shop Manager', 50000, 1),
  ('Sales Representive', 40000, 1),
  ('Grounds Keeper Manager', 60000, 2),
  ('Grass Cutter', 40000, 2),
  ('Snack Bar Manager', 65000, 3),
  ('Snack Bar', 38000, 3),
  ('HR Manager', 70000, 4),
  ('HR Assistant', 35000, 4);

-- Insert sample data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Kathryn', 'Doe', 1, NULL), -- Pro Shop Manager
  ('Casey', 'Smith', 2, 1),   -- Pro Shop Sales Rep, managed by Kathryn

  ('Theodore', 'Johnson', 3, NULL), -- Grounds Keeper Manager
  ('Lamar', 'Jackson', 4, 3),     -- Grass cutter, managed by Michael Johnson

  ('Theodore', 'Johnson', 5, NULL), -- Snack Bar Manager
  ('Lamar', 'Jackson', 6, 5),     -- Snack Bar Rep, managed by Theodore Johnson

  ('Mark', 'Andrews', 5, NULL),     -- HR Manager
  ('Derrick', 'Henry', 8, 5);        -- HR Assistant, managed by Mark Andrews
