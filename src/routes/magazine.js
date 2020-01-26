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
router.get('/', paginatedResults(), async (req, res) => {
  res.json(res.paginatedResults);
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

function paginatedResults() {
  return async (req, res, next) => {
    let query = {};
    const results = {};
    const { page, limit, title, minPoints, maxPoints, sortOption } = req.query;
    const fields = { Title1: 1, Title2: 1, issn: 1, 'Points.Value': 1, e_issn: 1 };
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let sortCriteria = {};
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
    if (typeof sortOption !== 'undefined') {
      if (sortOption === 'NameASC') {
        sortCriteria.Title1 = 1;
      }
      if (sortOption === 'NameDESC') {
        sortCriteria.Title1 = -1;
      }
      if (sortOption === 'PointsASC') {
        sortCriteria['Points.Value'] = 1;
      }
      if (sortOption === 'PointsDESC') {
        sortCriteria['Points.Value'] = -1;
      }
    } else {
      sortCriteria.Title1 = 1;
    }
    try {
      const magazines = await magazine
        .find(query, fields)
        .sort(sortCriteria)
        .exec();
      if (endIndex < magazines.length) {
        results.next = {
          page: parseInt(page, 10) + 1,
          limit: limit
        };
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        };
      }

      results.magazines = magazines.slice(startIndex, endIndex);
      res.paginatedResults = results;
      next();
      // await res.send({ Len: magazines.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error with fetching list of magazines' });
    }
  };
}

module.exports = router;
