const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri =
  'mongodb+srv://Ryan:7Kvszal8Uz7Oqzok@cluster0.couuu.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);
const databaseName = 'sample_weatherdata';
const collection = 'data';

module.exports = {};

// retrieve weather data for given call letters
module.exports.getWeatherByCallLetters = async (callLetters) => {
  const database = client.db(databaseName);
  const collectionData = database.collection(collection);

  const query = { callLetters: callLetters.toUpperCase() };
  let cursor = await collectionData.find(query).limit(10);

  return cursor
    ? cursor.toArray()
    : {
        error: `There was an error retrieving data. Please try again later.`,
      };
};

module.exports.createWeatherReport = async (weatherReport) => {
  const database = client.db(databaseName);
  const collectionData = database.collection(collection);

  const query = {};
  const result = await collectionData.insertOne(weatherReport);

  return result.acknowledged
    ? 'Weather report successfully created'
    : //? await module.exports.getMovieById(result.insertedId)
      { error: 'Something went wrong. Please try again.' };
};
