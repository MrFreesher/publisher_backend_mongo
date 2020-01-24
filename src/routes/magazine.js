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

  const { page, limit, title, minPoints, maxPoints } = req.query;
  const fields = { Title1: 1, Title2: 1, issn: 1, 'Points.Value': 1, e_issn: 1 };
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  if (typeof title !== 'undefined') {
    const reg = new RegExp(`${title}`);
    query.$or = [{ Title1: reg }, { Title2: reg }];
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
  try {
    const magazines = await magazine
      .find(query, fields)
      .skip(startIndex)
      .limit(endIndex)
      .exec();

    await res.send({ magazines: magazines });
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
router.get('/ids', (req, res, next) => {
  magazine
    .find({}, { _id: 1 })
    .then(data => {
      res.send(data);
      console.log(data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error with fetching ids about magazine' });
    });
});
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const object_id = new mongoose.Types.ObjectId(id);
  const result = magazine
    .findOne({ _id: object_id })
    .then(data => data)

    .then(data => {
      res.send(JSON.stringify(data));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error with fetching details about magazine' });
    });
});
/**
 * Route to get all ids of magazines
 */

module.exports = router;
