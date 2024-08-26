const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rtaa2003",
  database: "db" 
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection has been established");
});

app.get('/get/shops', (req, res) => {
  connection.query('SELECT * FROM shops', (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error getting shops' });
    } else {
      res.json(result);
    }
  });
});

app.get('/get/shops/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM shops WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error getting shop details' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Shop not found' });
    } else {  
      res.json(result[0]);
    }
  });
});

app.post('/post/shops', (req, res) => {
  const { name, location, contact_number, opening_hours, owner_name, website, description, rating } = req.body;
  connection.query('INSERT INTO shops (name, location, contact_number, opening_hours, owner_name, website, description, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
  [name, location, contact_number, opening_hours, owner_name, website, description, rating], (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error creating shop' });
    } else {
      res.status(201).json({ message: 'Shop created successfully' });
    }
  });
});

app.put('/put/shops/:id', (req, res) => {
  const id = req.params.id;
  const { name, location, contact_number, opening_hours, owner_name, website, description, rating } = req.body;
  connection.query('UPDATE shops SET name = ?, location = ?, contact_number = ?, opening_hours = ?, owner_name = ?, website = ?, description = ?, rating = ? WHERE id = ?', 
  [name, location, contact_number, opening_hours, owner_name, website, description, rating, id], (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Error updating shop' });
    } else {
      res.status(200).json({ message: 'Shop updated successfully' });
    }
  });
});

app.delete('/delete/shops/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM shops WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error deleting shop' });
    } else {
      res.status(200).json({ message: 'Shop deleted successfully' });
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
  console.log('Use the following URL in your browser to view the page http://localhost:5000/')
});
