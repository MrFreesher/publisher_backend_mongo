const express = require('express');

const app = express();
require('dotenv').config();

app.get('/test', (req, res) => {
  res.send({ message: "It's working" });
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
