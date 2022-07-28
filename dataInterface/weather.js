const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://Cahillmn:Ballard*85@cluster0.i33cd.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

module.exports.getAll = async () => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
  
    const query = {};
    let weatherCursor = await weather.find(query).limit(10);
  
    return weatherCursor.toArray();
  }

  module.exports.getByCallLetters = async (callLetters) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
    const query = { callLetters: callLetters };
    let weatherCursor = await weather.find(query).limit(10);
  
    return weatherCursor.toArray();
  }

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
  

