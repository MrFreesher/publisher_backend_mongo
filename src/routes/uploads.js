const router = require('express').Router();
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const magazine = require('../models/magazine');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => console.log('Open db'));
db.on('error', err => console.error(err));
router.post('/', upload.single('czasopismo'), (req, res) => {
  const { file } = req;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    res.send({ error: error.message });
  } else {
    const data = fs.readFileSync(
      path.join(__dirname, '../../', 'uploads', 'czasopismo.json'),
      'utf8'
    );
    const jsonData = JSON.parse(data);
    const magazineList = [];
    for (let i = 0; i < jsonData.length; i += 1) {
      const row = jsonData[i];
      magazineList.push({
        Tytul1: row['Tytuł 1'],
        Tytul2: row['Tytuł 2'],
        issn: row.issn,
        issn2: row.issn_2,
        e_issn: row['e-issn'],
        e_issn2: row['e-issn_2'],
        Categories: row.dziedziny,
        Points: {
          Year: new Date().getFullYear,
          Value: row.Punkty
        }
      });
    }
    magazine
      .create(magazineList)
      .then(() => res.send({ message: 'Success' }))
      .catch(err => {
        res.send({ message: 'Failed' });
        console.error(err);
      });
  }
});

module.exports = router;
