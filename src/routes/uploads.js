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
router.post('/', upload.single('czasopismo'), async (req, res) => {
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
        Title1: row['Tytuł 1'],
        Title2: row['Tytuł 2'],
        issn: row.issn,
        issn2: row.issn_2,
        e_issn: row['e-issn'],
        e_issn2: row['e-issn_2'],
        Categories: row.dziedziny,
        Points: [
          {
            Year: new Date().getFullYear(),
            Value: row.Punkty
          }
        ]
      });
    }
    let results = await magazine.count({}).exec();

    if (results === 0) {
      magazine
        .create(magazineList)
        .then(() => res.send({ message: 'Success' }))
        .catch(err => {
          res.send({ message: 'Failed' });
          console.error(err);
        });
    } else {
      try {
        for (let i = 0; i < 1; i += 1) {
          let searchTerm = await magazine.find({ issn: magazineList[i].issn }).exec();

          let updateMagazine = await compareMagazines(searchTerm[0], magazineList[i]);
          await console.log(updateMagazine);
          magazine
            .updateOne({ issn: magazineList[i]['issn'] }, updateMagazine)
            .then(() => res.send({ message: 'Update' }))
            .catch(err => console.error(err));
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
});
router.get('/', async (request, response) => {
  try {
    var result = await magazine.find().exec();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

async function compareMagazines(oldMagazine, newMagazine) {
  if (oldMagazine.Title1 !== newMagazine.Title1) {
    oldMagazine.Title1 = newMagazine.Title1;
  }
  if (oldMagazine.Title2 !== newMagazine.Title2) {
    oldMagazine.Title2 = newMagazine.Title2;
  }
  let oldCategories = JSON.stringify(oldMagazine.Categories);
  let newCategories = JSON.stringify(newMagazine.Categories);
  if (oldCategories !== newCategories) {
    oldMagazine.Categories = newMagazine.Categories;
  }
  const len = Object.keys(oldMagazine.Points).length;

  for (let g = 0; g < len; g++) {
    if (oldMagazine.Points[g].Year === new Date().getFullYear()) {
      if (oldMagazine.Points[g].Value !== newMagazine.Points[0].Value) {
        oldMagazine.Points[g].Value = newMagazine.Points[0].Value;
      }
    } else {
      oldMagazine.Points.push({
        Year: new Date().getFullYear(),
        Value: newMagazine.Points[0].Value
      });
    }
  }

  return oldMagazine;
}

module.exports = router;
