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

module.exports.getAllComments = async (movieId)=>{
    const database = client.db(databaseName);
    const comments = database.collection(commCollName);
    const query = { movie_id: ObjectId(movieId)}
    let commentCursor = await  comments.find(query)
    return commentCursor.toArray()
}

module.exports.getCommentById = async (commentId) => {
    const database = client.db(databaseName);
    const comments = database.collection(commCollName);
    const query = {_id: ObjectId(commentId)};
    let comment = await comments.findOne(query);

    return comment;
}

module.exports.getAComment = async (identifier) => {
    let comment;

    if(ObjectId.isValid(identifier)){
        comment = module.exports.getCommentById(identifier);
    }

    if(comment){
        return comment;
    } else {
        return {error: `No comment found with identifier ${identifier}.`}
    }
}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
module.exports.getById = async (movieId) => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);
    const query = {_id: ObjectId(movieId)};
    let movie = await movies.findOne(query);

    return movie;
}

module.exports.getByTitle = async (title) => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);
    const query = {title: title};
    let movie = await movies.findOne(query);

    return movie;
}

module.exports.getByIdOrTitle = async (identifier) => {
    let movie;

    if(ObjectId.isValid(identifier)){
        movie = module.exports.getById(identifier);
    } else {
        movie = module.exports.getByTitle(identifier);
    }

    if(movie){
        return movie;
    } else {
        return {error: `No item found with identifier ${identifier}.`}
    }
}

module.exports.createComment = async (movieId, newObj) =>{

    const database = client.db(databaseName);
    const comments = database.collection(commCollName);
    const goodObj = {...newObj, movie_id: ObjectId(movieId), date: new Date() }
    const result = await comments.insertOne(goodObj)
    if(result.acknowledged){
        return { newObjectId: result.insertedId, message: `Comment created! ID: ${result.insertedId}` }
    } else {
        return {error: "Something went wrong. Please try again."}
    }

}

// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.create = async (newObj) => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);

    if(!newObj.title){
        // Invalid movie object, shouldn't go in database.
        return {error: "Movies must have a title."}
    }
    const result = await movies.insertOne(newObj);

    if(result.acknowledged){
        return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
    } else {
        return {error: "Something went wrong. Please try again."}
    }
}

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/change-a-document/
module.exports.updateById = async (movieId, newObj) => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);

    // Product team says only these two fields can be updated.
    const updateRules = {
        $set: {"title" : newObj.title, "plot": newObj.plot}
    };
    const filter = { _id: ObjectId(movieId) };
    const result = await movies.updateOne(filter, updateRules);

    if(result.modifiedCount != 1){
        return {error: `Something went wrong. ${result.modifiedCount} movies were updated. Please try again.`}
    }

    const updatedMovie = module.exports.getById(movieId);
    return updatedMovie;
}

module.exports.updateCommentById = async (commentId, newObj) => {
    const database = client.db(databaseName);
    const comments = database.collection(commCollName);

    // Product team says only these two fields can be updated.
    const updateRules = {
        //$set: {"post" : newObj.post, "date": new Date()}
        $set: {"post" : newObj.post, "date": new Date()}
    };
    const filter = { _id: ObjectId(commentId) };
    const result = await comments.updateOne(filter, updateRules);

    if(result.modifiedCount !== 1){
        return {error: `Something went wrong. ${result.modifiedCount} comments were updated. Please try again.`}
    }

    const updatedComment = module.exports.getCommentById(commentId);
    return updatedComment;
}

module.exports.deleteCommentById = async (commentId)=>{
    const database = client.db(databaseName)
    const comments = database.collection(commCollName)
    const deletionRules = {_id:ObjectId(commentId)}
    const result = await comments.deleteOne(deletionRules)
    if(result.deletedCount !==1){
        return {error: `Something went wrong. ${result.deletedCount} comments were deleted. Please try again`}
    }

    return {message: `Deleted ${result.deletedCount} comment.`}
}

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/delete/
module.exports.deleteById = async (movieId) => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);

    const deletionRules = {_id:ObjectId(movieId)}
    const result = await movies.deleteOne(deletionRules);

    if(result.deletedCount != 1){
        return {error: `Something went wrong. ${result.deletedCount} movies were deleted. Please try again.`}
    };

    return {message: `Deleted ${result.deletedCount} movie.`};
}
