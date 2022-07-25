const res = require("express/lib/response");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://mig1035:T6hLiJHR2FBNbGPX@cluster0.ickzz.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  const databaseName = 'sample_mflix';
  const collName = 'movies';
  const commCollName = 'comments';
  
  module.exports = {}
  
  // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
  module.exports.getAll = async () => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);
  
    const query = {};
    let movieCursor = await movies.find(query).limit(10).project({title: 1}).sort({runtime: -1});
  
    return movieCursor.toArray();
  }
  
  module.exports.getAllComments = async (movieId)=>{
    const database = client.db(databaseName);
    const comments = database.collection(commCollName);
  
    // https://www.mongodb.com/docs/manual/reference/operator/query-comparison/
    // To get only comments made since 1985:
    // const query = {movie_id: ObjectId(movieId), date: { $gt: new Date("January 1, 1985")}}
    const query = { movie_id: ObjectId(movieId)};
  
    let commentCursor = await comments.find(query);
    return commentCursor.toArray();
  }

  module.exports.getSingleComment = async (commentId)=>{
    const database = client.db(databaseName);
    const comments = database.collection(commCollName);
  
    // https://www.mongodb.com/docs/manual/reference/operator/query-comparison/

    const query = {_id: ObjectId(commentId)};
  
    let commentCursor = await comments.findOne(query);
    return commentCursor
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
      movie = await module.exports.getById(identifier);
    } else {
      movie = await module.exports.getByTitle(identifier);
    }
  
    if(movie){
      return movie;
    } else {
      return {error: `No item found with identifier ${identifier}.`}
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
  
  module.exports.createComment = async(movieId, newObj) =>{
    const database = client.db(databaseName);
    const comments = database.collection(commCollName);


       //MovieExists is to validate that the movieId exists in the database 
        const movieExists = async (movieId) =>{
          const cursorCheck = async (movieId) => {
            const query = { movie_id: ObjectId(movieId)};
            const commentCursor = await comments.findOne(query);
            return commentCursor
          }

          cursorCheck(movieId)

          if( cursorCheck(movieId) ){
            return true
          } else {
            return false
          }
        }
  
    const goodObj = {...newObj, movie_id: ObjectId(movieId), date: new Date()}

    console.log({movie_id: ObjectId.isValid(movieId)})
    console.log(movieExists(movieId))

    const result = await comments.insertOne(goodObj);
  
    if(result.acknowledged && movieExists(movieId)){
      return { newObjectId: result.insertedId, message: `Comment created! ID: ${result.insertedId}` }
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
    } else {
      return {message: `Success! "${newObj.title}" has been successfully updated!`}
    }
  }
  

    // https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/change-a-document/
    module.exports.updateCommentById = async (commentId, newObj) => {
      const database = client.db(databaseName);
      const comments = database.collection(commCollName);
  

      const filter = { _id: ObjectId(commentId)};

      const updateRules = {
        $set: {"name" : newObj.name, "text": newObj.text, "date": `Comment updated on ${new Date()}`}
      };

      console.log(updateRules);
      const result = await comments.updateOne(filter, updateRules);
      console.log(filter)
      console.log(result);
    
      if(result.modifiedCount != 1){
        return {error: `Something went wrong. ${result.modifiedCount} movies were updated. Please try again.`}
      } else {
        return {message: `Success! your comment: "${newObj.text}" has been successfully updated!`}
      }
    }

  
  // https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/delete/
  module.exports.deleteById = async (movieId) => {
    const database = client.db(databaseName);
    const movies = database.collection(collName);
  
    const deletionRules = {_id:ObjectId(movieId)}
    const result = await movies.deleteOne(deletionRules);
  
    if(result.deletedCount != 1){
      return {error: `Something went wrong. ${result.deletedCount} movies were deleted. Please try again.`}
    } else {
      return {message: `Deleted ${result.deletedCount} movie.`}
  }
}
  
  module.exports.deleteCommentById = async(commentId) =>{
    const database = client.db(databaseName);
    const comments = database.collection(commCollName);
  
    const deletionRules = {_id:ObjectId(commentId)}
    const result = await comments.deleteOne(deletionRules);
  
    if(result.deletedCount != 1){
      return {error: `Something went wrong. ${result.deletedCount} comments were deleted. Please try again.`}
    } else{
      return {message: `Deleted ${result.deletedCount} comment`};
  }
}