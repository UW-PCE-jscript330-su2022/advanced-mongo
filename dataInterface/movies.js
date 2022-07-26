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
module.exports.getAll = async () => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);

  const query = {};
  let movieCursor = await movies
    .find(query)
    .limit(10)
    .project({ num_mflix_comments: 1 })
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
module.exports.getById = async (movieId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);
  const query = { _id: ObjectId(movieId) };
  let movie = await movies.findOne(query);

  console.log('movie = ', movie);

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
  if ((await module.exports.getById(movieId)).status === 200) {
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

  if (!(await module.exports.getById(movieId)).error) {
    const query = { movie_id: ObjectId(movieId) };
    const resultCursor = await comments.find(query);

    console.log('cursor:', resultCursor);
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

  return movie;
};

module.exports.getByIdOrTitle = async (identifier) => {
  let movie;

  if (ObjectId.isValid(identifier)) {
    movie = module.exports.getById(identifier);
  } else {
    movie = module.exports.getByTitle(identifier);
  }

  if (movie) {
    return movie;
  } else {
    return { error: `No item found with identifier ${identifier}.` };
  }
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
    ? // ? {
      //     newObjectId: result.insertedId,
      //     message: `Item created! ID: ${result.insertedId}`,
      //   }
      await module.exports.getById(result.insertedId)
    : { error: 'Something went wrong. Please try again.' };
};

module.exports.createComment = async (movieId, newCommentObj) => {
  const database = client.db(databaseName);
  if (!(await module.exports.getById(movieId)).error) {
    const comments = database.collection(collections.comments);
    const result = await comments.insertOne({
      ...newCommentObj,
      movie_id: ObjectId(movieId),
      date: new Date(),
    });

    return result.acknowledged
      ? `New comment created for movie id ${movieId}`
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
  // getById(id)
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

  const updatedMovie = module.exports.getById(movieId);
  return updatedMovie;
};

module.exports.updateCommentById = async (movieId, commentId, commentText) => {
  const database = client.db(databaseName);
  const comments = database.collection(collections.comments);

  let result = await comments.updateOne(
    { _id: ObjectId(commentId) },
    { $set: { text: commentText } }
  );

  return result.acknowledged
    ? {
        message: `Comment updated sucessfully.`,
      }
    : {
        error: `Something went wrong. Comment with id of commentId could not be updated. Please try again.`,
      };
};

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/delete/
module.exports.deleteById = async (movieId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);

  const deletionRules = { _id: ObjectId(movieId) };
  const result = await movies.deleteOne(deletionRules);

  if (result.deletedCount != 1) {
    return {
      error: `Something went wrong. ${result.deletedCount} movies were deleted. Please try again.`,
    };
  }

  return { message: `Deleted ${result.deletedCount} movie.` };
};
