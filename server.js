const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Create MySQL connection
let connection;

// Function to establish MySQL connection
const connectToDatabase = () => {
  connection = mysql.createConnection({
    host: 'sql3.freemysqlhosting.net',
    user: 'sql3691147',
    password: '9QI6jaM8hU',
    database: 'sql3691147'
  });

  // Connect to MySQL
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      // Retry connection
      setTimeout(connectToDatabase, 2000);
    } else {
      console.log('Connected to MySQL database');
    }
  });

  // Handle connection errors
  connection.on('error', err => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Attempting to reconnect to the database...');
      connectToDatabase();
    } else {
      throw err;
    }
  });
};

// Initialize database connection
connectToDatabase();

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define a route to fetch data from MySQL
app.get('/budgetdata', (req, res) => {
  const sql = 'SELECT * FROM budget';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Error fetching data from database');
      return;
    }
    res.json(results);
  });
});

// Sign-up endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
  
    const hash = bcrypt.hashSync(password, 2); // Hash the password
  
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(sql, [username, hash], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).send('Error creating user');
      }
      res.status(201).send('User created successfully');
    });
  });
  
  // Sign-in endpoint
  app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
  
    const sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).send('Error fetching user');
      }
      if (results.length === 0) {
        return res.status(401).send('Invalid credentials');
      }
  
      const user = results[0];
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send('Invalid credentials');
      }
  
      res.send('Sign-in successful');
    });
  });


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
