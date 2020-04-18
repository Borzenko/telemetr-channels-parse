const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/channels', async (req, res, next) => {
  const channelsCollection = await db.collection('channels')
  const perPage = 50
  const page = req.query.page ? req.query.page : 1
  
  const items = await channelsCollection.find()
    .skip(page > 0 ? ((page - 1) * perPage) : 0 )
    .limit(50)
    .toArray()
  const total = await channelsCollection.find().count()
  res.json({
    results: items,
    total
  })
});

module.exports = router;
