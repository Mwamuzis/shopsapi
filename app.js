const express = require('express');
const app = express();
const mysql = require('mysql');

// Connect to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'store_db'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Define a route to fetch all stores from the database
app.get('/stores', (req, res) => {
  connection.query('SELECT * FROM stores', (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// Define a route to fetch a store by ID from the database
app.get('/stores/:id', (req, res) => {
  connection.query('SELECT * FROM stores WHERE id = ?', [req.params.id], (error, results) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

// Define a route to add a new store to the database
app.post('/stores', (req, res) => {
  const { name, address, city, state, zipcode } = req.body;
  const sql = `INSERT INTO stores (name, address, city, state, zipcode) VALUES (?, ?, ?, ?, ?)`;
  connection.query(sql, [name, address, city, state, zipcode], (error, result) => {
    if (error) throw error;
    res.send({ id: result.insertId, name, address, city, state, zipcode });
  });
});

// Define a route to update a store by ID in the database
app.put('/stores/:id', (req, res) => {
  const { name, address, city, state, zipcode } = req.body;
  const sql = `UPDATE stores SET name = ?, address = ?, city = ?, state = ?, zipcode = ? WHERE id = ?`;
  connection.query(sql, [name, address, city, state, zipcode, req.params.id], (error, result) => {
    if (error) throw error;
    res.send({ message: 'Store updated' });
  });
});

// Define a route to delete a store by ID from the database
app.delete('/stores/:id', (req, res) => {
  connection.query('DELETE FROM stores WHERE id = ?', [req.params.id], (error, result) => {
    if (error) throw error;
    res.send({ message: 'Store deleted' });
  });
});

// Start the Express app
app.listen(3000, () => {
  console.log('Express app listening on port 3000');
});
