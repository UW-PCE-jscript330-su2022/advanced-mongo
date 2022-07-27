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