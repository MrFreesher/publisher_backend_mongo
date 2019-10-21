const mongoose = require('mongoose');
let MagazineScheme = mongoose.Schema({
  Tytul1: {
    type: String
  },
  Tytul2: {
    type: String
  },
  issn: {
    type: String
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
      Year: String,
      Value: String
    }
  ],
  Categories: [String]
});

module.exports = mongoose.model('Magazine', MagazineScheme);
