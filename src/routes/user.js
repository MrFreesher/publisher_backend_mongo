const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
/**
 * Route to register user.
 * Required params is login,password,firstName and lastName
 */
router.post('/signup', (req, res, next) => {
  User.findOne({ Login: req.body.login })
    .exec()
    .then(user => {
      if (user) {
        res.status(409).json({
          message: 'User with that login already exists'
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
                  message: 'User creation failed'
                });
                console.error(err);
              });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Problem with user creation'
      });
      console.error(err);
    });
});
/**
 * Route to login user.
 * Required params: login and password
 * Return an id of user
 */
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
              message: 'Incorrect password'
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
        message: 'Problem with login. Try again later'
      });
      console.error(err);
    });
});
/**
 * Route to change password for user
 * Required params: id,oldPassword,newPassword
 */
router.post('/changePassword', (req, res, next) => {
  const { id, oldPassword, newPassword } = req.body;
  const object_id = new mongoose.Types.ObjectId(id);
  User.findOne({ _id: object_id })
    .then(user => {
      if (user) {
        bcrypt.compare(oldPassword, user.Password, (err, result) => {
          if (err) {
            res.status(409).json({
              message: "It's an error. Please try again later."
            });
          }
          if (result) {
            bcrypt.hash(newPassword, 10, (err, hash) => {
              if (err) {
                res.status(409).json({
                  message: "It's an error. Please try again later."
                });
              }
              if (hash) {
                user.Password = hash;
                user
                  .save()
                  .then(data => {
                    res.status(200).json({
                      message: 'Password changed'
                    });
                  })
                  .catch(err => {
                    res.status(500).json({
                      message: 'Problem with changing password. Try again later.'
                    });
                    console.error(err);
                  });
              }
            });
          } else {
            res.status(409).json({
              message: "Passwords aren't the same."
            });
          }
        });
      } else {
        res.status(404).json({
          message: 'Cannot found user with that id.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Problem with changing password. Try again later.'
      });
      console.error(err);
    });
});

module.exports = router;
