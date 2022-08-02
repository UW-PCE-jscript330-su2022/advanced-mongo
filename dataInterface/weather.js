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
    let query = {};
    if (queryString.callLetters) {
        query.callLetters = {$eq: queryString.callLetters};
    }

    if (query.minAirTemp && query.maxAirTemp) {
        query.airTemperature.value ={$gt: parseInt(queryString.minAirTemp), $lt: parseInt(queryString.maxAirTemp)}
    } else if (query.minAirTemp && !query.maxAirTemp) {
        query.airTemperature.value = {$gt: parseInt(queryString.minAirTemp)};
    } else if (!query.minAirTemp && query.maxAirTemp) {
        query.airTemperature.value = {$lt: parseInt(queryString.maxAirTemp)};
    }
  
    if (query.sections) {
        query.sections = {$in: [queryString.section]};
    }

    let wDataCursor = await weatherData.find(query).limit(10);
  
    return wDataCursor.toArray();
  }