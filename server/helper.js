const db = require('./db')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    //Proxy helper

    proxyUrl() {
        const getRandomNumber = (min, max) => {
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }

        const hosts = [
            // '193.233.72.246',
            // '91.200.150.128',
            // '91.200.150.194',
            // '45.86.180.201',
            // '45.86.180.173',
            // '45.137.190.6',
            // //'194.67.210.235',
            // '5.8.76.209',
            // '5.8.76.197',
            // '89.223.100.122',
            // '89.223.100.119',
            // '45.134.27.178',
            // '193.9.60.181',
            // '194.1.239.225',
            // '45.84.225.179',
            // '45.84.225.180',
            // '193.32.188.230',
            // '193.32.188.113',
            // // '45.139.186.110',
            // '45.139.186.97',
            // '185.147.129.109',
            // '81.177.26.230',
            // '185.128.212.46',
            '91.218.246.73'

        ]
        const proxy = {
            // port: '27525',
            // user: "EPjErwx9M0",
            // password: "borovenko1996"
            port: '14808',
            user: "iluxa_ua_gmail_com",
            password: "AyIUY0"
        }
        //return "http://" + proxy.user + ":" + proxy.password + "@" + hosts[getRandomNumber(0, hosts.length - 1)] + ":" + proxy.port
        return "http://" + proxy.user + ":" + proxy.password + "@" + hosts[0] + ":" + proxy.port
    },

    //services helper
    async updateChannelCategory(data) {
        const channelsCollection = await db.collection('channels')
        if (data.type === 'add') {
            await channelsCollection.update({ '_id': ObjectId(data.id) }, { '$push': { 'categories': data.category } })
        } else {
            await channelsCollection.update({ '_id': ObjectId(data.id) }, { '$pull': { 'categories': data.category } })
        }

        const channel = await channelsCollection.findOne({ '_id': ObjectId(data.id) })
        return channel
    },


    async clearCollection() {
        const channelsCollection = await db.collection('channels')
        const channels = await channelsCollection.aggregate([
            {
                $group: {
                    _id: { channel_id: "$name" },
                    uniqueName: { $addToSet: "$_id" },
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    count: { "$gt": 1 }
                }
            }
        ]
        ).toArray()
        let idsForRemove = []
        for (let item of channels) {
            const duplicatedIds = await item.uniqueName.forEach((item, index) => {
                if (index !== 0) {
                    idsForRemove.push(ObjectId(item))
                }
            })
        }
        console.log(channels)

        await channelsCollection.remove({ '_id': { $in: idsForRemove } })

    }

}