const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const uri =
`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qlff5yn.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

// GET WEATHER ENDPOINT
// module.exports.getAll = async () => {
//     const database = client.db(databaseName);
//     const weather = database.collection(collName);
  
//     const query = {};
//     let weatherCursor = await  weather.find(query).limit(10);
//     return weatherCursor.toArray();
// }

// GET ALL BY PARAM
// GET WEATHER ENDPOINT
// maxAirTemp: { $max: "$airTemperature.value" }  minAirTemp: { $min: "$airTemperature.value" }
module.exports.getAll = async (callLetters, sections, maxAirTemp, minAirTemp) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);
  
  const query = {"callLetters": callLetters, sections: {$in: [sections]}, maxAirTemp:{ $max: $airTemperature.value }, minAirTemp:{ $min: $airTemperature.value }    };
  let weatherCursor = await weather.find(query).limit(10);
  return weatherCursor.toArray();
}

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

  const result = await weather.insertOne(newObj);

  if (result.acknowledged) {
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return { error: "Something went wrong. Please try again." }
  }
}

