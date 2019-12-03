const router = require('express').Router();
const mongoose = require('mongoose');
const magazine = require('../models/magazine');

router.get('/', async (req, res) => {
  let query = {};
  const { page, limit, title, minPoints, maxPoints } = req.body;
  console.log(title);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  if (typeof title !== 'undefined') {
    const reg = new RegExp(`^${title}`);
    query.Title1 = reg;
  }
  const points = {};
  if (minPoints !== 'undefined') {
    points['$gte'] = minPoints;
  }
  if (maxPoints !== 'undefined') {
    points['$lte'] = maxPoints;
  }
  if (Object.keys(points).length > 0) {
    query = { ...query, 'Points.Value': { ...points } };
  }
  console.log(query);
  try {
    const magazines = await magazine
      .find(query)
      .skip(startIndex)
      .limit(endIndex)
      .exec();

    await res.send({ lista: magazines });
    // await res.send({ Len: magazines.length });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Error' });
  }
});

module.exports = router;
