const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL;

module.exports = () => {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(MONGO_URL, (err, db) => {
        if (err) return reject(err);
        resolve();
    })
  });
}
