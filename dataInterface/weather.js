const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qlff5yn.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

// GET ALLWEATHER BY PARAM

module.exports.getAll = async (callLetters, sections, minAirTemp, maxAirTemp) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  let query = {};

  if (sections) {
    query.sections = sections;
  }

  if (callLetters) {
    query.callLetters = callLetters;
  }

  if (minAirTemp, maxAirTemp) {
    query['airTemperature.value'] = { $lte: parseInt(maxAirTemp) },{ $gte: parseInt(minAirTemp) };
  }

 let weatherCursor = await weather.find(query).limit(10).project({callLetters: 1, sections:1, "airTemperature.value":1});
 
 return weatherCursor.toArray();
}

// GET WEATHER BY CALL LETTERS ENPOINT
module.exports.getByCallLetters = async (callLetters) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  const query = { "callLetters": callLetters };
  let weatherCursor = await weather.find(query).limit(10);
  if (weatherCursor) {
    return weatherCursor.toArray();
  } else {
    return { error: "Something went wrong. Please try again." }
  }
}

// POST WEATHER
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  const result = await weather.insertOne(newObj);

  if (result.acknowledged) {
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return { error: "Something went wrong. Please try again." }
  }
}

