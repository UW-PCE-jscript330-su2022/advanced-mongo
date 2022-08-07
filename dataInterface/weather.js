const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://admin:vIefiAyna0YZzvaT@cluster0.6ghpl.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getByCallLetters = async ( callLetters ) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  const query = { callLetters: `${callLetters}` };
  let weatherCursor = await weather.find(query).limit(10).sort({runtime: -1});
  if(weatherCursor){
    return weatherCursor.toArray();
  } else {
    return {error: `No item found with callLetters ${callLetters}.`}
  }
}

module.exports.getByQuery =  ( minAirTemp,maxAirTemp,sections,callLetters ) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  let pipeline = [];

  if (sections) { 
    pipeline.push({
      '$match': {
        'sections': sections
      }
  })};
  if (callLetters) { pipeline.push({
    '$match': {
      'callLetters': callLetters
    }
  }) };

  if (minAirTemp && maxAirTemp) {
    pipeline.push({
      '$match': {
        'airTemperature.value': {
          '$gte': parseFloat(minAirTemp), 
          '$lte': parseFloat(maxAirTemp)
        }
      }
    })
  } else if (minAirTemp) {
    pipeline.push({
      '$match': {
        'airTemperature.value': {
          '$gte': parseFloat(minAirTemp), 
        }
      }
    })
  } else if (maxAirTemp) {
    pipeline.push({
      '$match': {
        'airTemperature.value': {
          '$lte': parseFloat(maxAirTemp)
        }
      }
    })
  }
  pipeline.push({ $limit : 10 });
  console.log(pipeline);
  const weatherCursor = weather.aggregate(pipeline);
  return weatherCursor.toArray();
}

module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const weather = database.collection(collName);

  if( !newObj.airTemperature.value || !newObj.sections || !newObj.callLetters ){
    return {error: "Input must have valid air temperature, section, and call letters"}
  }
  const result = await weather.insertOne(newObj);

  if(result.acknowledged){
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}