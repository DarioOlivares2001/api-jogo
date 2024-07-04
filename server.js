const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const productsFilePath = path.join(__dirname, 'data', 'productos.json');

// Leer usuarios del archivo JSON
function readUsersFromFile() {
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Escribir usuarios en el archivo JSON
function writeUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Leer productos del archivo JSON
function readProductsFromFile() {
  return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

// Escribir productos en el archivo JSON
function writeProductsToFile(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Rutas para usuarios
app.get('/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

app.post('/users', (req, res) => {
  const users = readUsersFromFile();
  const newUser = req.body;
  newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const users = readUsersFromFile();
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = updatedUser;
    writeUsersToFile(users);
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  let users = readUsersFromFile();
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  writeUsersToFile(users);
  res.status(204).end();
});

// Rutas para productos
app.get('/products', (req, res) => {
  const products = readProductsFromFile();
  res.json(products);
});

app.post('/products', (req, res) => {
  const products = readProductsFromFile();
  const newProduct = req.body;
  newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  products.push(newProduct);
  writeProductsToFile(products);
  res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const products = readProductsFromFile();
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products[index] = updatedProduct;
    writeProductsToFile(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/products/:id', (req, res) => {
  let products = readProductsFromFile();
  const productId = parseInt(req.params.id);
  products = products.filter(p => p.id !== productId);
  writeProductsToFile(products);
  res.status(204).end();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
