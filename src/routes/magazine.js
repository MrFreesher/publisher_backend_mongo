const router = require('express').Router();
const mongoose = require('mongoose');
const magazine = require('../models/magazine');

router.get('/', async (req, res) => {
  let query = magazine.find();
  const { page, limit, title } = req.body;
  console.log(req.body);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const magazines = await query
      .skip(startIndex)
      .limit(endIndex)
      .exec();
    res.send(magazines);
  } catch (err) {
    console.log(err);
    res.send({ message: 'Error' });
  }
});

module.exports = router;
