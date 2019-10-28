const mongoose = require('mongoose');

const MagazineScheme = mongoose.Schema({
  Tytul1: {
    type: String,
    required: true
  },
  Tytul2: {
    type: String
  },
  issn: {
    type: String,
    required: true
  },
  e_issn: {
    type: String
  },
  issn2: {
    type: String
  },
  e_issn2: {
    type: String
  },
  Points: [
    {
      Year: {
        type: String,
        required: true
      },
      Value: {
        type: String,
        required: true
      }
    }
  ],
  Categories: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Magazine', MagazineScheme);
