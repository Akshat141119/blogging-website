const { MongoClient } = require('mongodb');

const uri = 'YOUR_MONGODB_URI';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

function connect(callback) {
    client.connect(err => {
        if (err) {
            return callback(err);
        }
        db = client.db('blogging_website');
        callback();
    });
}

function getDb() {
    return db;
}

module.exports = {
    connect,
    getDb
};
