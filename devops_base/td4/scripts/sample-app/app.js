// app.js
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});
app.get('/name/:name', (req, res) => {
res.send(`Hello, ${req.params.name}!`);
});
module.exports = app;

app.get('/add/:a/:b', (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);

  // validation : il faut que a et b soient des nombres valides
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return res.status(400).send('Invalid input');
  }

  res.send(String(a + b));
});

// Gestion des routes inconnues
app.use((req, res) => {
  res.status(404).send('Not Found');
});

