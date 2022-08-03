const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
    "mongodb+srv://slartib:m0ng0rkdJScript330@cluster0.ipjwr.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {}

module.exports.getByCallLetters = async (callLettersIn) => {
    const database = client.db(databaseName);
    const weatherdata = database.collection(collName);
    const query = {callLetters: callLettersIn};
    const fields = {projection: {callLetters: 1, airTemperature: {value:  1}, dewPoint: {value: 1}, wind: {direction: {angle: 1}}   }};
    //const fields = {projection: {callLetters: 1 }};
    let weatherReport = await weatherdata.findOne(query, fields);

    if(weatherReport){
        return weatherReport;
    } else {
        return {error: `No item found with call letters ${callLetters}.`}
    }
}

module.exports.getByQuery = async (queryParams) => {
    console.log(queryParams);
    const database = client.db(databaseName);
    const weatherdata = database.collection(collName);
    try {
        if (!queryParams) {
            return {
                error: `Query parameters must be provided, at least one of minAirTemp, maxAirTemp, section or callLetters.`,
                type: 'NO_QUERY_PARAMS'
            }
        }
        if (!queryParams.minAirTemp && !queryParams.maxAirTemp && !queryParams.section && !queryParams.callLetters) {
            return {
                error: `Invalid query parameters provided, at least one of minAirTemp, maxAirTemp, section or callLetters must be included.`,
                type: 'INVALID_QUERY_PARAMS'
            }
        }
        let query = {}
        if (queryParams.minAirTemp) {
            if (isNaN(queryParams.minAirTemp)) {
                return {error: 'minAirTemp must be a number', type: 'INVALID_QUERY_VALUE'};
            }
            query = {...query, ...{"airTemperature.value": {$gt: Number(queryParams.minAirTemp)}}};
            console.log(JSON.stringify(query));
        }

        if (queryParams.maxAirTemp) {
            if (isNaN(queryParams.maxAirTemp)) {
                return {error: 'maxAirTemp must be a number', type: 'INVALID_QUERY_VALUE'};
            }
            query = {
                $and: [query,
                    {"airTemperature.value": {$lt: Number(queryParams.maxAirTemp)}}]
            }
            console.log(JSON.stringify(query));
        }

        if (queryParams.callLetters) {
            query = {...query, ...{callLetters: queryParams.callLetters}};
        }
        if (queryParams.section) {
            query = {...query, ...{sections: queryParams.section}};
        }
        console.log(JSON.stringify(query));

        let weatherReports = await weatherdata.find(query).limit(10);
        console.log(JSON.stringify(weatherReports));

        return weatherReports.toArray();
    } catch (e) {
        return {error: e, type: "EXCEPTION"};
    }
}

module.exports.create = async (newObj) => {
    const database = client.db(databaseName);
    const weatherdata = database.collection(collName);

    if(!newObj.callLetters){
        // Invalid movie object, shouldn't go in database.
        return {error: "Weather data must have callLetters"}
    }
    const result = await weatherdata.insertOne(newObj);

    if(result.acknowledged){
        return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
    } else {
        return {error: "Something went wrong. Please try again."}
    }
}
