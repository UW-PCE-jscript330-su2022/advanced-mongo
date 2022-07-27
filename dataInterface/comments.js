const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://jilinda10:liaNg331*)@cluster0.f4ghe7b.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_mflix';
const collName = 'comments'

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAllComments = async (movieId)=>{

    const database = client.db(databaseName);
  const comments = database.collection(collName);

  const query = {movie_id: movieId};
  let commentCursor = await movies.find(query).limit(10).project({text: 1}).sort({runtime: -1});

  return commentCursor.toArray();
}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
module.exports.getCommentByCommentIdOrMovieId = async (commentId) => {
  const database = client.db(databaseName);
  const comments = database.collection(collName);
  let query = {_id: ObjectId(commentId)};
  let comment = await comments.findOne(query);

  if (comment) {
    return comment;
  } else {
    return {error: `No item found with identifier ${commentIdOrMovieId}.`}
  }
}


// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.createComment = async (newObj) => {
  const database = client.db(databaseName);
  const comments = database.collection(collName);

  if(!newObj.text || !newObj.movie_id){
    // Invalid movie object, shouldn't go in database.
    return {error: "Comments must have a text and a movie id associated with it."};
  }

  const movies = database.collection("movies");
  const movieExist = await movies.findOne(query);

  if (!movieExist) {
    return {error: "Movie must exist for the commented to be inserted for."};
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
    $set: {"name" : newObj.name, "email": newObj.email, "movie_id": newObj.movieId, "text": newObj.text, "date": newObj.date}
  };
  const filter = { movie_id: ObjectId(movieId), _id: ObjectId(newObj._id) };
  const result = await movies.updateOne(filter, updateRules);

  if(result.modifiedCount != 1){
    return {error: `Something went wrong. ${result.modifiedCount} movies were updated. Please try again.`}
  };

  const updatedComment = module.exports.getById(movieId);
  return updatedComment;
}

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/delete/
module.exports.deleteCommentById = async (commentId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);

  const deletionRules = {_id:ObjectId(commentId)}
  const result = await movies.deleteOne(deletionRules);

  if(result.deletedCount != 1){
    return {error: `Something went wrong. ${result.deletedCount} movies were deleted. Please try again.`}
  };

  return {message: `Deleted ${result.deletedCount} movie.`};
}











