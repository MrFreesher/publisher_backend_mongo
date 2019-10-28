const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const uploadRouter = require('./routes/uploads');

const app = express();

app.use(morgan('dev'));
app.use('/upload', uploadRouter);
app.get('/test', (req, res) => {
  res.send({ message: "It's working" });
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
