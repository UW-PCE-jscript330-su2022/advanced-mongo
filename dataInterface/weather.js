const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://jilinda10:liaNg331*)@cluster0.f4ghe7b.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data'

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAll = async () => {
  const database = client.db(databaseName);
  const weatherData = database.collection(collName);

  const query = {};
  let wDataCursor = await weatherData.find(query).limit(10).project({st: 1}).sort({ts: -1});

  return wDataCursor.toArray();
}

module.exports.getByQueryString = async (queryString) => {
    const database = client.db(databaseName);
    const weatherData = database.collection(collName);
  console.log(queryString);
    const query = {"callLetters": {$exists: 1, $eq: queryString.callLetters}, 
        "airTemperature": {$exists: 1, $gt: queryString.minAirTemp, $lt: queryString.maxAirTemp}, 
        "section": {$exists: 1, $in: [queryString.section]}};
    console.log(query);
    let wDataCursor = await weatherData.find(query).limit(10);
  
    return wDataCursor.toArray();
  }