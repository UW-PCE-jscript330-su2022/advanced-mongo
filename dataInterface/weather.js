const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

// uri is from mongodb account > Connect > Connect your app > Driver: Node
const uri = "mongodb+srv://user1:user1@cluster0.qshjt0w.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {};

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAllByCallLetter = async (callLetter) => {
  const database = client.db(databaseName);
  const weatherData = database.collection(collName);
  const query = { callLetters: callLetter };
  let resultCursor = await weatherData.find(query).limit(10);
  // .limit(10).project({title: 1}).sort({runtime: -1})
  return resultCursor.toArray();
}

module.exports.getByParameter = async (movieId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);
  const query = {_id: ObjectId(movieId)};
  let movie = await movies.find(query).limit(10);

  return movie;
}

module.exports.createWeatherDocument = async (title) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);
  const query = {title: title};
  let movie = await movies.insertOne(query);

  return movie;
}
