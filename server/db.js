const Mongo = require('mongodb')

module.exports = {
    connect(mongoDbUrl = 'mongodb://127.0.0.1:27017/telemetr-channels-parse') {
        if (!this.db) {
            return Mongo.MongoClient.connect(mongoDbUrl, {
                promiseLibrary: Promise
            })
                .then(db => {
                    this.db = db
                    return db
                })
        }
        return Promise.resolve(this.db)
    },
    collection(collection) {
        return this.connect()
            .then(db => {
                return db.collection(collection)
            })
            .catch({'message': 'error'})
    }
}
