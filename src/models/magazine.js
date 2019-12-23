const mongoose = require('mongoose');

const MagazineScheme = mongoose.Schema({
  Title1: {
    type: String,
    required: true
  },
  Title2: {
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
        type: Number,
        required: true
      },
      Value: {
        type: Number,
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
