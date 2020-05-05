const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/categories', async (req, res) => {
    const catCollection = await db.collection('categories')
    let categ = await catCollection.findOne({})
    return res.json(categ.categories)
})

module.exports = router;