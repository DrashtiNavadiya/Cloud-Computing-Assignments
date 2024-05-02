const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'database-1.cnkye8m2c6ff.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  port: 3306
});

app.get("/check" , (req , res) => {
    console.log("Check success");
    res.send("Working");
})

app.get('/create-table', (req, res) => {
    console.log("Create fired");
  connection.query('CREATE DATABASE IF NOT EXISTS productsDB', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log('Database created or already exists');

    connection.changeUser({ database: 'productsDB' }, (err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      console.log('Connected to the productsDB database');

      connection.query(`
        CREATE TABLE IF NOT EXISTS products (
          name VARCHAR(100),
          price VARCHAR(100),
          availability BOOLEAN
        )
      `, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        console.log('Table created or already exists');
        res.status(200).json({ message: 'Table created or already exists.' });
      });
    });
  });
});

app.delete('/empty-products', (req, res) => {
    console.log("delete fired");
  connection.query('DELETE FROM products', (err) => {
    if (err) {
      console.error('Error emptying products table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log('Products table emptied');
    res.status(200).json({ message: 'Products table emptied.' });
  });
});

app.post('/store-products', (req, res) => {
    console.log("store fired");
  const requestData = req.body;
  const products = requestData.products;

  products.forEach((product) => {
    connection.query(
      'INSERT INTO products (name, price, availability) VALUES (?, ?, ?)',
      [product.name, product.price, product.availability],
      (err) => {
        if (err) {
          console.error('Error storing product:', err);
        }
      }
    );
  });

  res.status(200).json({ message: 'Success.' });
});

app.get('/list-products', (req, res) => {
    console.log("list products fired");
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error retrieving products:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(results);
    res.status(200).json({ products: results });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
