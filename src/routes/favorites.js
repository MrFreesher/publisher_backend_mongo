const router = require('express').Router();
const mongoose = require('mongoose');
const Favorite = require('../models/favorite');
const Magazine = require('../models/magazine');
/**
 * Route to add magazine to favorites
 * Required params: userId,magazineId
 */
router.post('/', (req, res, next) => {
  const { userId, magazineId } = req.body;
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const objectMagazineId = new mongoose.Types.ObjectId(magazineId);

  const newFavorite = new Favorite({ userId: objectUserId, magazineId: objectMagazineId });
  newFavorite
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Added magazine to favorites'
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Problem with save magazine as favorite.Try again later.'
      });
    });
});
/**
 * Route to get favorites for user
 * Required params: userId
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  let data = [];
  await Favorite.find({ userId: id })
    .then(result => {
      data = result.map(it => it.magazineId);
    })
    .catch(err => {
      res.json({
        message: 'error with fetching data for that user'
      });
    });

  const objectMagazineIdArr = data.map(it => new mongoose.Types.ObjectId(it));
  const magazines = await Magazine.find({})
    .where('_id')
    .in(objectMagazineIdArr)
    .exec();
  await res.status(200).send(JSON.stringify(magazines));
});
/**
 * Route to remove magazine from favorites
 * Required params: userId,magazineId
 */
router.delete('/', async (req, res, next) => {
  const { userId, magazineId } = req.body;

  const objectUserId = new mongoose.Types.ObjectId(userId);
  const objectMagazineId = new mongoose.Types.ObjectId(magazineId);
  try {
    const favoriteItem = await Favorite.findOne({
      userId: objectUserId,
      magazineId: objectMagazineId
    }).exec();
    await console.log(favoriteItem);
    Favorite.deleteMany({ _id: favoriteItem._id }).exec((err, result) => {
      console.log(result);
      if (err) {
        res.status(500).json({
          message: 'Problem with deleting favorites'
        });
      }

      res.status(200).json({
        message: 'Deleting favorites is completed'
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "It's problem with execution of request",
      error: err
    });
  }
});
module.exports = router;
