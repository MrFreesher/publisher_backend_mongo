const router = require('express').Router();
const mongoose = require('mongoose');
const magazine = require('../models/magazine');
/**
 *
 * Get a list of magazines with some parameters
 * Required :
 * page - number of page
 * limit - number of elements per page
 * title - word or phrase at begin or middle text
 * minPoints - minimum value of points
 * maxPoints - maximum value of points
 *
 */
router.get('/', async (req, res) => {
  let query = {};
  let query2 = {};
  const { page, limit, title, minPoints, maxPoints } = req.query;
  const fields = { Title1: 1, Title2: 1, issn: 1, 'Points.Value': 1, e_issn: 1 };
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  if (typeof title !== 'undefined') {
    const reg = new RegExp(`${title}`);
    query.Title1 = reg;
    query2.Title2 = reg;
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
    query2 = { ...query2, 'Points.Value': { ...points } };
  }
  try {
    const magazines = await magazine
      .find(query, fields)
      .skip(startIndex)
      .limit(endIndex)
      .exec();
    const magazines2 = await magazine
      .find(query2, fields)
      .skip(startIndex)
      .limit(endIndex)
      .exec();
    const connectedMagazines = [...magazines, ...magazines2];
    await res.send({ magazines: connectedMagazines });
    // await res.send({ Len: magazines.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error with fetching list of magazines' });
  }
});
/**
 *
 * Find a details about magazine by id
 * Required:
 * id - id of searched magazines
 *
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const object_id = new mongoose.Types.ObjectId(id);
  const result = magazine
    .findOne({ _id: o_id })
    .then(data => data)
    .then(data => res.send({ data: data }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error with fetching details about magazine' });
    });
});

module.exports = router;
