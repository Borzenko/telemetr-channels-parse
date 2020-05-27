const express = require('express');
const router = express.Router();
const db = require('../db');
const helper = require('../helper');



router.get('/channels', async (req, res, next) => {
  console.log(req.query)
  const channelsCollection = await db.collection('channels')
  const perPage = 50
  const page = req.query.page ? req.query.page : 1
  const filter = req.query.filter ? JSON.parse (req.query.filter) : {
    $or: [{
      categories: { $elemMatch: { $eq: "Прогнозы и ставки" } }
    }, {
      categories: { $size: 0 }
    }]
  }
  
  const items = await channelsCollection.find(filter)
    .sort( { created_at: -1 } )
    .skip(page > 0 ? ((page - 1) * perPage) : 0 )
    .limit(50)
    .toArray()
  const total = await channelsCollection.find(filter)
  .count()
  res.json({
    results: items,
    total
  })
});
router.put('/channels', async (req, res) => {
  const channel = await helper.updateChannelCategory(req.body)
  res.json(channel)
})

module.exports = router;