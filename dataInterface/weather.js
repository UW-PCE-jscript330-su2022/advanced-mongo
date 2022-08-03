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

  if(wDataCursor && wDataCursor.toArray().length > 0){
    return wDataCursor.toArray();
} else {
    return {error: `No item was found.`}
  }
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
  
    if(wDataCursor && wDataCursor.toArray().length > 0){
        return wDataCursor.toArray();
    } else {
        return {error: `No item was found with the query strings.`}
      }
  }

  module.exports.getAverage = async () => {
    const database = client.db(databaseName);
    const weatherData = database.collection(collName);
  
    const pipeline = [
        {
          '$match': {
            'airTemperature.value': {
              '$gt': 5, 
              '$lt': 10
            }
          }
        }, {
          '$group': {
            '_id': '$ts', 
            'averageTemperature': {
              '$avg': '$airTemperature.value'
            }
          }
        }, {
          '$sort': {
            'averageTemperature': 1
          }
        }, {
          '$limit': 10
        }
      ];
    let wDataCursor = await weatherData.aggregate(pipeline);
  
    if(wDataCursor){
      return wDataCursor.toArray();
    } else {
      return {error: `No item was found.`}
    }
  }

  module.exports.create = async (newObj) => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);
    
    if(!newObj.airTemperature){
      // Invalid movie object, shouldn't go in database.
      return {error: "Movies must have a title."}
    }
    const result = await movies.insertOne(newObj);
  
    if(result.acknowledged){
      return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
    } else {
      return {error: "Something went wrong. Please try again."}
    }
  }

