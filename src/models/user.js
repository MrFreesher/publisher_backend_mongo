const mongoose = require('mongoose');

const UserScheme = mongoose.Schema({
  Login: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('User', UserScheme);
