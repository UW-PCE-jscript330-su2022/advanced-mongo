const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;


const uri =
  "mongodb+srv://cahilljm53:Mevin*80@cluster0.qlff5yn.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

// GET WEATHER ENDPOINT
module.exports.getAll = async () => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
  
    const query = {};
    let weatherCursor = await  weather.find(query).limit(10);
    return weatherCursor.toArray();
}

// GET WEATHER BY ID ENDPOINT
module.exports.getWeatherById = async (weatherId) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  const query = { _id: ObjectId(weatherId)};
  let result = await  weather.find(query);
    return result;
}

// GET WEATHER BY PARAMETER (minAirTemp, maxAirTemp, section, callLetters)


// GET WEATHER BY CALL LETTERS ENPOINT
module.exports.getByCallLetters = async (callLetters) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
  
    const query = {"callLetters": callLetters};
    let weatherCursor = await  weather.find(query).limit(30);
    return weatherCursor.toArray();
}

// POST WEATHER
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  // if (!newObj.title) {
  //   // Invalid weather object, shouldn't go in database.
  //   return { error: "Movies must have a title." }
  // }
  const result = await weather.insertOne(newObj);

  if (result.acknowledged) {
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return { error: "Something went wrong. Please try again." }
  }
}