const router = require('express').Router();
const mongoose = require('mongoose');
const magazine = require('../models/magazine');

router.get('/', async (req, res) => {
  const query = {};
  const { page, limit, title } = req.body;
  console.log(req.body);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  if (title !== 'undefined' || title !== '') {
    const reg = new RegExp(`^${title}`);
    query.Tytul1 = reg;
    console.log(query);
  }
  try {
    const magazines = await magazine
      .find(query)
      .skip(startIndex)
      .limit(endIndex)
      .exec();

    await res.send({ lista: magazines });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Error' });
  }
});

module.exports = router;
