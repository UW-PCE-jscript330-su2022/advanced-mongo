const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
'mongodb+srv://Hgupta9:kThYyac606OgE3xQ@cluster0.s2g6ids.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

const dbName = 'sample_weatherdata';
const colName = 'data';
module.exports = {}

    module.exports.getByCallLetters = async (callLetter) => {
        const database = client.db(dbName);
        const data = database.collection(colName);
        const query = { "callLetters":  callLetter};
        let weatherDetails = await data.find(query).limit(10);
        if (weatherDetails) {
            return weatherDetails.toArray();
          } else {
            return { error: "Something went wrong. Please try again." }
          }
    }

    module.exports.create = async (newObj) => {
        const database = client.db(dbName);
        const data = database.collection(colName);
      
        const result = await data.insertOne(newObj);
      
        if(result.acknowledged){
          return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
        } else {
          return {error: "Something went wrong. Please try again."}
        }
      }



    module.exports.getAllWeatherReport = async (minAirTemp, maxAirTemp, section, callLetters) => {
        const database = client.db(dbName);
        const data = database.collection(colName);

        const query = {
            "callLetters": {$in: callLetters},
            "sections": {$in: section},
            "minAirTemp": {$gte: (parseFloat(minAirTemp))},
            "maxAirTemp": {$lte: (parseFloat(maxAirTemp))} 
        }

        let weatherCursor = await data.find(query).limit(10).project({callLetters: 1, sections: 1, minAirTemp: 1, maxAirTemp: 100});
        return weatherCursor.toArray();
    }