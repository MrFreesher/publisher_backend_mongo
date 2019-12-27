const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.findOne({ Login: req.body.login })
    .exec()
    .then(user => {
      if (user) {
        res.status(409).json({
          message: 'User with that login already exist'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              message: 'Problem with creating user. Try again later.'
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              Login: req.body.login,
              Password: hash,
              FirstName: req.body.firstName,
              LastName: req.body.lastName
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: 'User creation failed',
                  error: err
                });
              });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Problem with user creation',
        error: err
      });
    });
});
router.post('/login', (req, res, next) => {
  User.findOne({ Login: req.body.login })
    .exec()
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.Password, (err, result) => {
          if (err) {
            res.status(401).json({
              message: 'Auth failed'
            });
          }
          if (result) {
            res.status(200).json({
              message: 'Auth success',
              data: {
                id: user._id
              }
            });
          } else {
            res.status(401).json({
              message: 'Auth failed'
            });
          }
        });
      } else {
        res.status(401).json({
          message: "User with that login doesn't exist"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Problem with login. Try again later',
        error: err
      });
    });
});

module.exports = router;
