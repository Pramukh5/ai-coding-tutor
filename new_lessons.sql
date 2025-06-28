-- SQL statements to add new lessons to the 'lessons' table

-- Python Lessons
INSERT INTO lessons (title, description, initial_code)
VALUES 
('Python Variables', 'Learn how to declare and use variables in Python.', 'name = "Alice"\nage = 30\nprint(f"Name: {name}, Age: {age}")'),
('Python Functions', 'Understand how to define and call functions in Python.', 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Bob"))');

-- JavaScript Lessons
INSERT INTO lessons (title, description, initial_code)
VALUES 
('JavaScript Arrays', 'Discover how to work with arrays in JavaScript.', 'const fruits = ["Apple", "Banana", "Cherry"];\nconsole.log(fruits.length);\nfruits.forEach(fruit => console.log(fruit));'),
('JavaScript Objects', 'Learn to use objects for storing keyed collections of data.', 'const person = {\n  firstName: "John",\n  lastName: "Doe",\n  age: 50\n};\nconsole.log(person.firstName);');

-- TypeScript Lessons
INSERT INTO lessons (title, description, initial_code)
VALUES 
('TypeScript Interfaces', 'Learn how to use interfaces to define contracts for object shapes.', 'interface User {\n  name: string;\n  id: number;\n}\n\nconst user: User = {\n  name: "Alice",\n  id: 1\n};\nconsole.log(user);'),
('TypeScript Generics', 'Understand how to write reusable, type-safe functions with generics.', 'function identity<T>(arg: T): T {\n    return arg;\n}\n\nlet output = identity<string>("myString");\nconsole.log(output);');

-- SQL Lessons
INSERT INTO lessons (title, description, initial_code)
VALUES 
('SQL SELECT Statement', 'Learn how to retrieve data from a database using the SELECT statement.', 'SELECT * FROM customers;'),
('SQL WHERE Clause', 'Understand how to filter records using the WHERE clause.', 'SELECT * FROM products WHERE price > 50;');
