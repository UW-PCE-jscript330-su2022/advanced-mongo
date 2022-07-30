const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
    "mongodb+srv://candy-dev:nIcjQAp7LPdpzDhm@cluster0.xaqhzyx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const databaseName = 'sample_weatherdata';
const collName = 'data'

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/

module.exports.getMinTemp =  (min) => {
    const query = {
        airTemperature: {$gte: {value: min}}
    }
    return query;
}

module.exports.getMaxTemp =  (max) => {
    const query = {
        airTemperature: {$lte: {value: max}}
    }
    return query;
}

module.exports.getSection = (section) => {
    const query = {
        sections: {
            "$in": [section]
        }
    }
    return query;
}

module.exports.getTempRange = (min, max) => {
    const query = {$and:[{airTemperature: {$gte:{value:min}}},{airTemperature: {$lte:{value: max}}}]}
    return query;
}

module.exports.getCallLetters =  (callLetters) => {
    const query = {
        callLetters: {$eq: callLetters}
    }
    return query;
}

module.exports.getCallLettersMinTemp = (callLetters, min) => {
    const query = {
        airTemperature: {$gte: {value: min}},
        callLetters: {$eq: callLetters}
    }
    return query;
}

module.exports.getMinSection =  (min, section) => {
    const query = {
        airTemperature: {$gte: {value: min}},
        sections: {
            "$in": [section]
        }
    }
    return query;
}

module.exports.getMaxSection =  (max, section) => {
    const query = {
        airTemperature: {$lte: {value: max}},
        sections: {
            "$in": [section]
        }
    }
    return query;
}

module.exports.getMaxCallLetters =  (max, callLetters) => {
    const query = {
        airTemperature: {$lte: {value: max}},
        callLetters: {$eq: callLetters}

    }
    return query;
}

module.exports.getSectionCallLetters =  (section, callLetters) => {
    const query = {
        sections: {
            "$in": [section]
        },
        callLetters: {$eq: callLetters}
    }
    return query;
}

module.exports.getTempRangeSection = (min, max, section) => {
    const query = {
        $and:[{airTemperature: {$gte:{value:min}}},{airTemperature: {$lte:{value: max}}}],
        sections: {
            "$in": [section]
        }
    }
    return query;
}

module.exports.getTempRangeCallLetters = (min, max, callLetters) => {
    const query = {
        $and:[{airTemperature: {$gte:{value:min}}},{airTemperature: {$lte:{value: max}}}],
        callLetters: {$eq: callLetters}
    }
    return query;
}

module.exports.getMinSectionCallletters =  (min, section, callLetters) => {
    const query = {
        airTemperature: {$gte: {value: min}},
        sections: {
            "$in": [section]
        },
        callLetters: {$eq: callLetters}
    }
    return query;
}

module.exports.getMaxSectionCallletters =  (max, section, callLetters) => {
    const query = {
        airTemperature: {$lte: {value: max}},
        sections: {
            "$in": [section]
        },
        callLetters: {$eq: callLetters}
    }
    return query;
}

module.exports.getTempRangeSectionCallLetters = (min, max, section, callLetters) => {
    const query = {
        $and:[{airTemperature: {$gte:{value:min}}},{airTemperature: {$lte:{value: max}}}],
        sections: {
            "$in": [section]
        },
        callLetters: {$eq: callLetters}
    }
    return query;
}


module.exports.getAll = async (minAirTemp, maxAirTemp, section, callLetters) => {
    // if a query parameter is missing, it console logs as 'undefined'

    const min = Number(minAirTemp)
    const max = Number(maxAirTemp)

    // if not present in the query string, its NaN after the conversion

    const database = client.db(databaseName);
    const weather = database.collection(collName);

    if(minAirTemp!==undefined && maxAirTemp===undefined && section===undefined&&callLetters===undefined){
        const myQuery = module.exports.getMinTemp(min)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    }else if(minAirTemp!==undefined && maxAirTemp!==undefined && section===undefined && callLetters===undefined){
        const myQuery = module.exports.getTempRange(min, max)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    }else if(section!==undefined && minAirTemp===undefined && maxAirTemp===undefined && callLetters===undefined){
        const myQuery = module.exports.getSection(section)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    }else if(callLetters!==undefined && minAirTemp!==undefined && maxAirTemp===undefined && section===undefined){
        const myQuery = module.exports.getCallLettersMinTemp(callLetters, min)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp===undefined && maxAirTemp!==undefined && section===undefined && callLetters===undefined){
        const myQuery = module.exports.getMaxTemp(max)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp===undefined && maxAirTemp===undefined && section===undefined && callLetters!==undefined){
        const myQuery = module.exports.getCallLetters(callLetters)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp!==undefined && maxAirTemp===undefined && section!==undefined && callLetters===undefined){
        const myQuery = module.exports.getMinSection(min, section)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp===undefined && maxAirTemp!==undefined && section!==undefined && callLetters===undefined){
        const myQuery = module.exports.getMaxSection(max, section)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp===undefined && maxAirTemp!==undefined && section===undefined && callLetters!==undefined){
        const myQuery = module.exports.getMaxCallLetters(max, callLetters)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp===undefined && maxAirTemp===undefined && section!==undefined && callLetters!==undefined){
        const myQuery = module.exports.getSectionCallLetters(section, callLetters)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp!==undefined && maxAirTemp!==undefined && section!==undefined && callLetters===undefined){
        const myQuery = module.exports.getTempRangeSection(min, max, section)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp!==undefined && maxAirTemp!==undefined && section===undefined && callLetters!==undefined){
        const myQuery = module.exports.getTempRangeCallLetters(min, max, callLetters)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp!==undefined && maxAirTemp===undefined && section!==undefined && callLetters!==undefined){
        const myQuery = module.exports.getMinSectionCallletters(min, section, callLetters)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp===undefined && maxAirTemp!==undefined && section!==undefined && callLetters!==undefined){
        const myQuery = module.exports.getMaxSectionCallletters(max, section, callLetters)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp!==undefined && maxAirTemp!==undefined && section!==undefined && callLetters!==undefined){
        const myQuery = module.exports.getTempRangeSectionCallLetters(min, max, section, callLetters)
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    } else if(minAirTemp===undefined && maxAirTemp===undefined && section===undefined && callLetters===undefined){
        const myQuery={}
        let weatherCursor = await weather.find(myQuery).limit(10);
        return weatherCursor.toArray()
    }

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
    console.log(identity)
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
