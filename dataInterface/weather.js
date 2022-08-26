const e = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://carlitos:test@cluster0.o87d0no.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const databaseName = 'sample_weatherdata';
const dataCollection = 'data'

module.exports = {}

module.exports.getAll = async() =>{
  const database = client.db(databaseName);
  const data = database.collection(dataCollection);
  const query = {};
  let weatherDataCursor = await data.find(query).limit(2);

  return weatherDataCursor.toArray();
}


module.exports.getByLetters = async (params)=>{
  const database = client.db(databaseName);
  const data = database.collection(dataCollection);
  if(typeof params === 'object'){
    let query = {callLetters: String(params.callLetters)}
    let result = data.find(query).limit(10)
    return result.toArray()
  }else{
    if(params.startsWith('callLetters=')){
      let value = params.slice(12)
      module.exports.getByLetters(value)
    }
    console.log('here')
    let query = {callLetters: params}
    let result = data.find(query).limit(10)
    return result.toArray()
  }
  

}


module.exports.getQuery = async(params) =>{
  const database = client.db(databaseName);
  const data = database.collection(dataCollection);
  if(Object.keys(params).length === 0){
    let result = await module.exports.getAll()
    return result
  }
  if(params.minAirTemp && !params.maxAirTemp){
    let query = {"airTemperature.value": {$gt: Number(params.minAirTemp)}}
    let result = await data.find(query).limit(10)
    return result.toArray()
  }
  if(params.maxAirTemp && !params.minAirTemp){
    let query = {"airTemperature.value": {$lt: Number(params.maxAirTemp)}}
    let result = await data.find(query).limit(10)
    return result.toArray()
  }
  if(params.minAirTemp && params.maxAirTemp){
    let query = {"airTemperature.value": {$gt: Number(params.minAirTemp), $lt: Number(params.maxAirTemp)}}
    let result = await data.find(query).limit(10)
    return result.toArray()
  }
  if(params.section){
    let query = {sections: {$all: [String(params.section)]}}
    let result = await data.find(query).limit(10)
    return result.toArray()
  }
  if(params.callLetters && !params.minAirTemp){
    return module.exports.getByLetters(params)
  }
  if(params.callLetters && params.minAirTemp){
    let query = {callLetters: String(params.callLetters), "airTemperature.value": {$gt: Number(params.minAirTemp)} }
    let result = await data.find(query).limit(10)
    return result.toArray()
  }
}

module.exports.create = async (params) =>{
  const database = client.db(databaseName)
  const data = database.collection(dataCollection)
  if(Object.keys(params).length === 0){
    return {Error: 'Failed to Create'}
  }

  const result = await data.insertOne(params)
  if( await result.acknowledged){
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return {Error: "Failed to Create"}
  }
  
  
}

// {
//   "_id": "5553a998e4b02cf71511a020",
//   "st": "x+47400-070400",
//   "ts": "1984-03-06T18:00:00.000Z",
//   "position": {
//           "type": "Point",
//           "coordinates": [
//                   -70.4,
//                   47.4
//           ]
//   },
//   "elevation": 9999,
//   "callLetters": "VA71",
//   "qualityControlProcess": "V020",
//   "dataSource": "4",
//   "type": "FM-13",
//   "airTemperature": {
//           "value": 999.9,
//           "quality": "9"
//   },
//   "dewPoint": {
//           "value": 999.9,
//           "quality": "9"
//   },
//   "pressure": {
//           "value": 9999.9,
//           "quality": "9"
//   },
//   "wind": {
//           "direction": {
//                   "angle": 230,
//                   "quality": "1"
//           },
//           "type": "N",
//           "speed": {
//                   "rate": 10.8,
//                   "quality": "1"
//           }
//   },
//   "visibility": {
//           "distance": {
//                   "value": 20000,
//                   "quality": "1"
//           },
//           "variability": {
//                   "value": "N",
//                   "quality": "9"
//           }
//   },
//   "skyCondition": {
//           "ceilingHeight": {
//                   "value": 99999,
//                   "quality": "9",
//                   "determination": "9"
//           },
//           "cavok": "N"
//   },
//   "sections": [
//           "AG1",
//           "AY1",
//           "GA1",
//           "GF1",
//           "MW1"
//   ],
//   "precipitationEstimatedObservation": {
//           "discrepancy": "2",
//           "estimatedWaterDepth": 0
//   },
//   "pastWeatherObservationManual": [
//           {
//                   "atmosphericCondition": {
//                           "value": "0",
//                           "quality": "1"
//                   },
//                   "period": {
//                           "value": 6,
//                           "quality": "1"
//                   }
//           }
//   ],
//   "skyCoverLayer": [
//           {
//                   "coverage": {
//                           "value": "09",
//                           "quality": "1"
//                   },
//                   "baseHeight": {
//                           "value": 99999,
//                           "quality": "9"
//                   },
//                   "cloudType": {
//                           "value": "99",
//                           "quality": "9"
//                   }
//           }
//   ],
//   "skyConditionObservation": {
//           "totalCoverage": {
//                   "value": "09",
//                   "opaque": "99",
//                   "quality": "1"
//           },
//           "lowestCloudCoverage": {
//                   "value": "09",
//                   "quality": "1"
//           },
//           "lowCloudGenus": {
//                   "value": "99",
//                   "quality": "9"
//           },
//           "lowestCloudBaseHeight": {
//                   "value": 99999,
//                   "quality": "9"
//           },
//           "midCloudGenus": {
//                   "value": "99",
//                   "quality": "9"
//           },
//           "highCloudGenus": {
//                   "value": "99",
//                   "quality": "9"
//           }
//   },
//   "presentWeatherObservationManual": [
//           {
//                   "condition": "02",
//                   "quality": "1"
//           }
//   ]
// }