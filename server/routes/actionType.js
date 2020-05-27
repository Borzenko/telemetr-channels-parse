const express = require('express');
const router = express.Router();
const db = require('../db');

router.put('/channels/actionType', async (req, res) => {
    console.log(req.body)
    const id = req.body.id
    const action_type = req.body.action_type
    const channelsCollection = await db.collection('channels')
    await channelsCollection.update({ 'channel_id': id }, { '$set': { action_type } }, {multi:true})
    res.status(201).send()
})

module.exports = router;