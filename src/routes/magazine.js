const router = require('express').Router();
const mongoose = require('mongoose');
const magazine = require('../models/magazine');

router.get('/', async (req, res) => {
  let query = {};
  const { page, limit, title, minPoints, maxPoints } = req.body;
  console.log(title);
  const fields = { Title1: 1, issn: 1, 'Points[0].Value': 1, e_issn: 1 };
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  if (typeof title !== 'undefined') {
    const reg = new RegExp(`^${title}`);
    query.Title1 = reg;
  }
  const points = {};
  if (typeof minPoints !== 'undefined') {
    points['$gte'] = minPoints;
  }
  if (typeof maxPoints !== 'undefined') {
    points['$lte'] = maxPoints;
  }
  if (Object.keys(points).length > 0) {
    query = { ...query, 'Points.Value': { ...points } };
  }
  console.log(query);
  try {
    const magazines = await magazine
      .find(query, fields)
      .skip(startIndex)
      .limit(endIndex)
      .exec();

    await res.send({ magazines });
    // await res.send({ Len: magazines.length });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Error' });
  }
});
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  const o_id = new mongoose.Types.ObjectId(id);
  const result = magazine
    .find({ _id: o_id })
    .then(data => data)
    .then(data => res.send({ data: data }))
    .catch(err => {
      console.log(err);
      res.send({ message: 'Error' });
    });
  console.log(result);
  // if (result) {
  //   res.send({ magazine: result });
  // }
});

module.exports = router;
