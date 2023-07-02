const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/data/participants.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'data', 'participants.json'));
});

app.listen(8080, () => {
  console.log('Servidor Express iniciado en el puerto 8080');
});
