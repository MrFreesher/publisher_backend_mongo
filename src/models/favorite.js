const mongoose = require('mongoose');

const favoriteScheme = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  magazineId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});
module.exports = mongoose.model('Favorite', favoriteScheme);
