const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
    "mongodb+srv://candy-dev:nIcjQAp7LPdpzDhm@cluster0.xaqhzyx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const databaseName = 'sample_weatherdata';
const collName = 'data'

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAll = async () => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
    const query = {};
    let weatherCursor = await weather.find(query).limit(10);
    return weatherCursor.toArray();
}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
module.exports.getById = async (weatherId) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);
    const query = {_id: ObjectId(weatherId)};
    let record = await weather.findOne(query);

    return record;
}

module.exports.getByCallLetter = async (identity) => {
    //console.log(identity)
    const database = client.db(databaseName);
    const weather = database.collection(collName);
    const records = await weather.find({callLetters: {$eq: identity}}).limit(10)
    return records.toArray();
}

module.exports.getByIdOrCallLetter = async (identifier) => {
    //console.log(identifier)
    let records;

    if(ObjectId.isValid(identifier)){
        records = module.exports.getById(identifier);
    } else {
        records = module.exports.getByCallLetter(identifier);
    }

    if(records){
        return records;
    } else {
        return {error: `No item found with identifier ${identifier}.`}
    }
}

// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.create = async (newObj) => {
    const database = client.db(databaseName);
    const weather = database.collection(collName);

    if(!newObj.airTemperature.value){
        // Invalid weather object, shouldn't go in database.
        return {error: "Weather post must have an air temperature value."}
    }
    const result = await weather.insertOne(newObj);

    if(result.acknowledged){
        return { newObjectId: result.insertedId, message: `Weather object created! ID: ${result.insertedId}` }
    } else {
        return {error: "Something went wrong. Please try again."}
    }
}
