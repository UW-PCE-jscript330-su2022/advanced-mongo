const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://admin:vIefiAyna0YZzvaT@cluster0.6ghpl.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getByCallLetter = async () => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  const query = {};
  let weatherCursor = await weather.find(query).limit(10).project({title: 1}).sort({runtime: -1});

  return weatherCursor.toArray();
}

