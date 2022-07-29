const res = require("express/lib/response");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://mig1035-2:VKCdurOepu0NfDNZ@cluster0.ickzz.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  const databaseName = 'sample_weatherdata';
  const collName = 'data';
  
  module.exports = {}


//   // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
  module.exports.getByCallLetters = async (userCallLetters) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
  
    const query = {callLetters: userCallLetters};
  
    let weatherCursor = await weather.find(query);
  
    return weatherCursor.toArray();
  };

  module.exports.create = async (newObj) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
  
    if(!newObj.callLetters){
      // Invalid movie object, shouldn't go in database.
      return {error: "Weather Data must have Call Letters!"}
    }
    console.log(newObj)
    const result = await weather.insertOne(newObj);
  
    if(result.acknowledged){
      return { newObjectId: result.insertedId, message: `Weather Data created! ID: ${result.insertedId} , Call Letters: ${newObj.callLetters}, elevation: ${newObj.elevation}` }
    } else {
      return {error: "Something went wrong. Please try again."}
    }
  }
  
  //   // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
  module.exports.searchWeather = async (userQuery) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
  
    const query = {userQuery};

    return {}
  
    // let weatherCursor = await weather.find(userQuery);
  
    // return weatherCursor.toArray();
  };
