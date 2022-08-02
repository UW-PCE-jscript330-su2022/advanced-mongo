const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i33cd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

module.exports.getAll = async (callLetters,sections,minAirTemp,maxAirTemp) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
  
    const query = {"callLetters":callLetters, sections: {$in: [sections]},"airTemperature.value": { $gte: (parseFloat(minAirTemp)), $lte: (parseFloat(maxAirTemp)) }};

    console.log(minAirTemp);
    console.log(maxAirTemp);
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
  

