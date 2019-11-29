const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const uploadRouter = require('./routes/uploads');
const magazineRouter = require('./routes/magazine');
const app = express();
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/upload', uploadRouter);
app.use('/magazines', magazineRouter);
app.get('/test', (req, res) => {
  res.send({ message: "It's working" });
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
