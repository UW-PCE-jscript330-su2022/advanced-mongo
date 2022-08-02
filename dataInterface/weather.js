const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://artrodrig3:ad345P82Papu94PH@cluster0.schch.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';
const database = client.db(databaseName);
const weathers = database.collection(collName);

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAll = async(minAirTemp, maxAirTemp, sections, callLetters) => {
    const query = {}

    if (minAirTemp) {
        query['airTemperature.value'] = { $gte: parseInt(minAirTemp) };
    }
    
    if (maxAirTemp) {
        query['airTemperature.value'] = { $lte: parseInt(maxAirTemp) };
    }
    
    if (sections) {
        query.sections = {$in: [sections]};
    }
    
    if (callLetters) {
        query.callLetters = callLetters;
    }
    
    // const query = {
    //     "airTemperature.value": {
    //         $lte: parseFloat(minAirTemp),
    //         $gte: parseFloat(maxAirTemp)
    //      },
    //      "sections": {$in: [sections]},
    //      "callLetters": {$in: [callLetters]}

    let weatherCursor = await weathers.find(query).limit(10);

    return weatherCursor.toArray();
}

module.exports.getCallLetters = async(callLetters) => {
    const query = {"callLetters": callLetters};
    const result = await weathers.find(query).limit(10);

    return result.toArray()
}

module.exports.createWeatherEntry = async(newObj) => {
    const newWeatherEntry = await weathers.insertOne(newObj);

    if(newWeatherEntry.acknowledged){
        return { message: `Item created! ID: ${newWeatherEntry.insertedId}` }
    } else {
        return { error: "Something went wrong. Please try again." }
    }
}

module.exports.deleteWeatherEntry = async (weatherId) => {
    const findEntryToDelete = { _id:ObjectId(weatherId) };
    const deleteEntry = await weathers.deleteOne(findEntryToDelete);

    if(deleteEntry.deletedCount != 1) {
        return {error: `Something went wrong ${weatherId} not found.`}
    } else {
        return {message: `Deleted weather entry# ${weatherId}.`};
    }
}