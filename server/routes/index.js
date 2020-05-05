const express = require('express');
const router = express.Router();
const db = require('../db');
const helper = require('../helper');



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
router.put('/channels', async (req, res) => {
  helper.updateChannelCategory(req.body)
})

module.exports = router;
