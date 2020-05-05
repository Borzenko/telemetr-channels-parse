const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/channels', async (req, res, next) => {
  const channelsCollection = await db.collection('channels')
  const perPage = 50
  const page = req.query.page ? req.query.page : 1
  
  const items = await channelsCollection.find({
    $or: [{
      categories: { $elemMatch: { $eq: "Прогнозы и ставки" } }
    }, {
      categories: { $size: 0 }
    }]
  })
    .sort( { created_at: -1 } )
    .skip(page > 0 ? ((page - 1) * perPage) : 0 )
    .limit(50)
    .toArray()
  const total = await channelsCollection.find({
    $or: [{
      categories: { $elemMatch: { $eq: "Прогнозы и ставки" } }
    }, {
      categories: { $size: 0 }
    }]
  }).count()
  res.json({
    results: items,
    total
  })
});

router.get('/categories', async (req, res) => {
  const catCollection = await db.collection('categories')
  let categ = await catCollection.findOne({})
  return res.json(categ.categories)
})

module.exports = router;
