const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri =
  'mongodb+srv://Ryan:7Kvszal8Uz7Oqzok@cluster0.couuu.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collection = 'data';

const database = client.db(databaseName);
const collectionData = database.collection(collection);

module.exports = {};

module.exports.getWeatherReports = async (
  minAirTemp,
  maxAirTemp,
  section,
  callLetters
) => {
  let query = {};
  let projection = {};

  if (minAirTemp || maxAirTemp) {
    query['airTemperature.value'] = {};
    projection['airTemperature.value'] = 1;
  }

  if (minAirTemp) {
    query['airTemperature.value']['$gte'] = parseFloat(minAirTemp);
  }

  if (maxAirTemp) {
    query['airTemperature.value']['$lte'] = parseFloat(maxAirTemp);
  }

  if (section) {
    query.sections = section;
    projection.sections = 1;
  }

  if (callLetters) {
    query.callLetters = callLetters;
    projection.callLetters = 1;
  }

  console.log('query = ', query);

  let cursor = await collectionData.find(query).limit(10).project(projection);

  return cursor
    ? cursor.toArray()
    : {
        error: `There was an error retrieving data. Please try again later.`,
      };
};

// retrieve weather data for given call letters
module.exports.getWeatherByCallLetters = async (callLetters) => {
  const query = { callLetters: callLetters.toUpperCase() };
  let cursor = await collectionData.find(query).limit(10);

  console.log('cursor = ', cursor);

  return cursor
    ? cursor.toArray()
    : {
        error: `There was an error retrieving data. Please try again later.`,
      };
};

module.exports.createWeatherReport = async (weatherReport) => {
  const result = await collectionData.insertOne(weatherReport);

  return result.acknowledged
    ? `Weather report ${result.insertedId} successfully created`
    : { error: 'Something went wrong. Please try again.' };
};
