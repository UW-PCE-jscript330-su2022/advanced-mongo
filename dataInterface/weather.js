////////////////////////////////////////////////////////////////////////////////
// /dataInterface/weather.js ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const { MongoClient } = require("mongodb");
const { get } = require("../routes");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const uri =
  "mongodb+srv://jelizaga:" + encodeURIComponent(process.env.MONGODB_PSWD) + 
  "@cluster0.xhlewuy.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const weatherCollName = 'data';

module.exports = {}

// getWeatherReportsByCallLetters //////////////////////////////////////////////
// Given valid `callLetters`,
// Returns an array of weather reports possessing the same `callLetters`.
// Docs:
module.exports.getWeatherReportsByCallLetters = async (callLetters) => {
  const database = client.db(databaseName);
  const weather = database.collection(weatherCollName);
  const query = { callLetters: callLetters };
  let weatherCursor = await weather.find(query).limit(10);
  if (!weatherCursor) {
    return { status: 500, error: "Something went wrong. Please try again." };
  } else {
    return weatherCursor.toArray();
  }
}

// createWeatherReport /////////////////////////////////////////////////////////
// Given a `newWeatherReport`,
// Adds `newWeatherReport` to the `weatherDatabase` and returns the
// `newObjectId` with a success message.
// Docs: https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.createWeatherReport = async (newWeatherReport) => {
  const database = client.db(databaseName);
  const weather = database.collection(weatherCollName);
  if (!newWeatherReport.callLetters) {
    return { error: "Weather report must have `callLetters`." };
  }
  const result = await weather.insertOne(newWeatherReport);
  if (!result.acknowledged) {
    return { error: "Something went wrong. Please try again." };
  } else {
    return { 
      newObjectId: result.insertedId, 
      message: `Item created! ID: ${result.insertedId}` 
    };
  }
}

// getWeatherReportsByQuery ////////////////////////////////////////////////////
// Given `queryParameters`,
// Returns an array of weather reports.
module.exports.getWeatherReportsByQuery = async (minAirTemp, maxAirTemp, section, callLetters) => {
  // Check query for errors:
  const queryErrors = await 
    validateWeatherReportQuery(minAirTemp, maxAirTemp, section, callLetters);
  // If errors, return errors:
  if (queryErrors.length != 0) {
    return { errors: queryErrors };
  // Otherwise, query the database:
  } else {
    const database = client.db(databaseName);
    const weather = database.collection(weatherCollName);
    const query = await buildWeatherQuery(parseFloat(minAirTemp), parseFloat(maxAirTemp), section, callLetters);
    console.log(query);
    const weatherCursor = await weather.find(query).limit(10);
    if (!weatherCursor) {
      return { error: "Something went wrong. Please try again." };
    } else {
      return weatherCursor.toArray();
    }
  }
}

// buildWeatherQuery ///////////////////////////////////////////////////////////
// Given `minAirTemp`, `maxAirTemp`, `section`, & `callLetters`,
// Returns a query object with a constructed weather report query.
const buildWeatherQuery = async (minAirTemp, maxAirTemp, section, callLetters) => {
  let query = {};
  let queriedTemperatures = {};
  if (minAirTemp) {
    queriedTemperatures.$gte = minAirTemp;
  }
  if (maxAirTemp) {
    queriedTemperatures.$lte = maxAirTemp;
  }
  if (Object.keys(queriedTemperatures).length !== 0) {
    query = { "airTemperature.value": queriedTemperatures }
  }
  if (section) {
    query.sections = { $in: [section] };
  }
  if (callLetters) {
    query.callLetters = callLetters;
  }
  return query;
} 

// validateWeatherReportQuery //////////////////////////////////////////////////
// Given `minAirTemp`, `maxAirTemp`, `section`, & `callLetters`,
// Returns an array with errors regarding the validity of these values.
const validateWeatherReportQuery = async (minAirTemp, maxAirTemp, section, callLetters) => {
  let errors = [];
  if (minAirTemp && Number.isNaN(parseFloat(minAirTemp))) {
    errors.push(`minAirTemp must be a number: ${minAirTemp} is not a number.`);
  } 
  if (maxAirTemp && Number.isNaN(parseFloat(maxAirTemp))) {
    errors.push(`maxAirTemp must be a number: ${maxAirTemp} is not a number.`);
  }
  if (section) {
    if (section.length != 3) {
      errors.push(`section must be 3 characters: ${section} is not 3 characters.`);
    }
  }
  if (callLetters) {
    if (callLetters.length != 4) {
      errors.push(`callLetters must be 4 characters: ${callLetters} is not 4 characters.`);
    }
  }
  return errors;
}