const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri =
  'mongodb+srv://Ryan:7Kvszal8Uz7Oqzok@cluster0.couuu.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);
const databaseName = 'sample_mflix';

const collections = {
  movies: 'movies',
  comments: 'comments',
};

const statusCodes = require('../etc/statusCodes.js');

module.exports = {};

// GET all movies from movies collection in sample_mflix database
module.exports.getAllMovies = async () => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);

  const query = {};
  let movieCursor = await movies
    .find(query)
    .limit(10)
    //    .project({ num_mflix_comments: 1 })
    .sort({ runtime: -1 });

  return !!movieCursor
    ? movieCursor.toArray()
    : {
        error: `We've encountered an error. Please try again later.`,
      };
};

// GET all movie comments from comments collection in sample_mflix database
module.exports.getAllComments = async () => {
  const database = client.db(databaseName);
  const comments = database.collection(collections.comments); // notice connecting to comments collection

  const query = {};

  let movieCursor = await comments.find(query);
  return movieCursor.toArray();
};

// GET single movie by id from movies collection in sample_mflix database
module.exports.getMovieById = async (movieId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);
  const query = { _id: ObjectId(movieId) };
  let movie = await movies.findOne(query);

  return movie
    ? movie
    : {
        error: `We've encountered an error. Please try again later.`,
      };
};

// GET one comment with comment id
module.exports.getCommentById = async (movieId, commentId) => {
  const database = client.db(databaseName);
  const comments = database.collection(collections.comments);
  if (!movieExists(movieId).error) {
    const query = { _id: ObjectId(commentId) };
    const result = await comments.findOne(query);

    return result
      ? result
      : {
          error: `There was an error retrieving comment data. Please try again later.`,
        };
  } else {
    return {
      error: `There was an error retrieving movie data. Please try again later.`,
    };
  }
};

// GET all comments for a single movie comments collection in sample_mflix database
module.exports.getMovieComments = async (movieId) => {
  const database = client.db(databaseName);
  const comments = database.collection(collections.comments);

  if (!movieExists(movieId).error) {
    const query = { movie_id: ObjectId(movieId) };
    const resultCursor = await comments.find(query);

    return resultCursor
      ? await resultCursor.toArray()
      : {
          error: `There was an error retrieving comment data. Please try again later.`,
        };
  } else {
    return {
      error: `There was an error retrieving movie data. Please try again later.`,
    };
  }
};

// GET single movie by title string from movies collection in sample_mflix database
module.exports.getByTitle = async (title) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);
  const query = { title: title };
  let movie = await movies.findOne(query);

  return movie
    ? movie
    : {
        error: `There was an error retrieving movie data. Please try again later.`,
      };
};

module.exports.getByIdOrTitle = async (identifier) => {
  let movie;

  if (ObjectId.isValid(identifier)) {
    movie = module.exports.getMovieById(identifier);
  } else {
    movie = module.exports.getByTitle(identifier);
  }

  return movie
    ? movie
    : { error: `No item found with identifier ${identifier}.` };
};

// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.createMovie = async (newObj) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);

  if (!newObj.title) {
    // Invalid movie object, shouldn't go in database.
    return { error: 'Movies must have a title.' };
  }
  const result = await movies.insertOne(newObj);

  return result.acknowledged
    ? await module.exports.getMovieById(result.insertedId)
    : { error: 'Something went wrong. Please try again.' };
};

module.exports.createComment = async (movieId, newCommentObj) => {
  const database = client.db(databaseName);
  if (!movieExists(movieId).error) {
    const comments = database.collection(collections.comments);
    const result = await comments.insertOne({
      ...newCommentObj,
      movie_id: ObjectId(movieId),
      date: new Date(),
    });

    return result.acknowledged
      ? module.exports.getCommentById(movieId, result.insertedId.toString())
      : {
          error: `There was an error submitting comment data. Please try again later.`,
        };
  } else {
    return {
      error: `There was an error retrieving movie data. Please try again later.`,
    };
  }
};

module.exports.deleteComment = async (id, commentId) => {
  //check to see if movie is in database
  // getMovieById(id)
  //   ?
  //   : res.status(404).
  // //if movie in database, delete comment
  return {};
};

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/change-a-document/
module.exports.updateById = async (movieId, newObj) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);

  // Product team says only these two fields can be updated.
  const result = await movies.updateOne(
    { _id: ObjectId(movieId) },
    { $set: { title: newObj.title, plot: newObj.plot } }
  );

  if (result.modifiedCount != 1) {
    return {
      error: `Something went wrong. ${result.modifiedCount} movies were updated. Please try again.`,
    };
  }

  const updatedMovie = module.exports.getMovieById(movieId);
  return updatedMovie;
};

module.exports.updateCommentById = async (movieId, commentId, commentText) => {
  const database = client.db(databaseName);
  if (!movieExists(movieId).error) {
    const comments = database.collection(collections.comments);

    let result = await comments.updateOne(
      { _id: ObjectId(commentId) },
      { $set: { text: commentText } }
    );

    return result.acknowledged
      ? module.exports.getCommentById(movieId, commentId)
      : {
          error: `There was an error updating comment data. Please try again later.`,
        };
  } else {
    return {
      error: `There was an error retrieving movie data. Please try again later.`,
    };
  }
};

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/delete/
module.exports.deleteById = async (movieId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);

  const deletionRules = { _id: ObjectId(movieId) };
  const result = await movies.deleteOne(deletionRules);

  if (result.deletedCount != 1) {
    return {
      error: `Something went wrong. Please try again.`,
    };
  }

  return `Movie with id of ${movieId} successfully deleted.`;
};

let movieExists = async (movieId) => {
  return await module.exports.getMovieById(movieId).error;
};
