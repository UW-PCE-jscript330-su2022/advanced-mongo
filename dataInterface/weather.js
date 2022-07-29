////////////////////////////////////////////////////////////////////////////////
// /dataInterface/weather.js ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const uri =
  "mongodb+srv://jelizaga:" + encodeURIComponent(process.env.MONGODB_PSWD) + "@cluster0.xhlewuy.mongodb.net/?retryWrites=true&w=majority"
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
    return { error: "Something went wrong. Please try again." };
  } else {
    return weatherCursor.toArray();
  }
}

// createWeatherReport /////////////////////////////////////////////////////////
// Given a `newWeatherReport`,
// Adds `newWeatherReport` to the `weatherDatabase` and returns the `newObjectId`
// with a success message.
// Docs: https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.createWeatherReport = async (newWeatherReport) => {
  const database = client.db(databaseName);
  const weather = database.collection(weatherCollName);
  if (!newWeatherReport.callLetters) {
    return {error: "Weather report must have `callLetters`."}
  }
  const result = await weather.insertOne(newWeatherReport);
  if(result.acknowledged) {
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}

// getWeatherReportsByQuery ////////////////////////////////////////////////////
// Given `queryParameters`,
// Returns an array of weather reports 
// Docs:
module.exports.getWeatherReportsByQuery = async(movieId, newObj) => {
  const database = client.db(databaseName);
  const weather = database.collection(weatherCollName);
  // const movieExists = await module.exports.getById(movieId);
  // if (movieExists) {
  //   const goodObj = {...newObj, movie_id: ObjectId(movieId), date: new Date()};
  //   const result = await weather.insertOne(goodObj);
  //   if(result.acknowledged){
  //     return { newObjectId: result.insertedId, message: `Comment created! ID: ${result.insertedId}` }
  //   } else {
  //     return {error: "Something went wrong. Please try again."}
  //   }
  // } else {
  //   return {error: `No item found with identifier ${movieId}.`}
  // }
}