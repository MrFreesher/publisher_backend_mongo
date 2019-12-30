const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const uploadRouter = require('./src/routes/uploads');
const magazineRouter = require('./src/routes/magazine');
const userRouter = require('./src/routes/user');
const favoriteRouter = require('./src/routes/favorites');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/upload', uploadRouter);
app.use('/magazines', magazineRouter);
app.use('/user', userRouter);
app.use('/favorites', favoriteRouter);
app.get('/test', (req, res) => {
  res.send({ message: "It's working" });
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
