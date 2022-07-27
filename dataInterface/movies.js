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

// retrieve all movies from database
module.exports.getAllMovies = async () => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);

  const query = {};
  let movieCursor = await movies
    .find(query)
    .projection({ genre: 1 })
    .limit(10)
    .sort({ runtime: -1 });

  return movieCursor
    ? movieCursor.toArray()
    : {
        error: `There was an error retrieving movie data. Please try again later.`,
      };
};

// retrieve all movie comments from database
module.exports.getAllComments = async () => {
  const database = client.db(databaseName);
  const comments = database.collection(collections.comments); // notice connecting to comments collection

  const query = {};

  let movieCursor = await comments.find(query);
  return movieCursor.toArray();
};

// retrieve single movie by id from database
module.exports.getMovieById = async (movieId) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);
  const query = { _id: ObjectId(movieId) };
  let movie = await movies.findOne(query);

  return movie
    ? movie
    : {
        error: `There was an error retrieving movie data. Please try again later.`,
      };
};

// retrieve one comment with unique comment id value
module.exports.getCommentById = async (movieId, commentId) => {
  if (!validateId(movieId) || !validateId(commentId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
    if (!validateId(movieId)) {
      return { error: `Invalid id value. Please try again` };
    }
    const database = client.db(databaseName);
    const comments = database.collection(collections.comments);
    const query = { _id: ObjectId(commentId) };
    const result = await comments.findOne(query);

    console.log('result = ', result);

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

// retrieve movies that match a given genre
module.exports.getMoviesByGenre = async (genreName) => {
  const database = client.db(databaseName);
  const movies = database.collection(collections.movies);
  let movieCursor = await movies
    .find({ genres: genreName })
    .limit(10)
    .project({ title: 1, genres: 1 });

  const result = await movieCursor.toArray();

  return result.length > 0
    ? result
    : {
        error: `There was an error retrieving movie data. Please try again later.`,
      };
};

// retrieve all comments for a single movie
module.exports.getMovieComments = async (movieId) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
    const database = client.db(databaseName);
    const comments = database.collection(collections.comments);

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

// retrieve single movie by title
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

// retrieve movies by id or title
module.exports.getByIdOrTitle = async (identifier) => {
  let movie;

  if (validateId.isValid(identifier)) {
    movie = module.exports.getMovieById(identifier);
  } else {
    movie = module.exports.getByTitle(identifier);
  }

  return movie
    ? movie
    : { error: `No item found with identifier ${identifier}.` };
};

// add new movie to database
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

// add new comment to database
module.exports.createComment = async (movieId, newCommentObj) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
    const database = client.db(databaseName);
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

// update a movie by movie id value
module.exports.updateById = async (movieId, newObj) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

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

// update a comment by comment id value
module.exports.updateCommentById = async (movieId, commentId, commentText) => {
  if (!validateId(movieId) || !validateId(commentId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
    const database = client.db(databaseName);
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

// delete a movie by movie id value
module.exports.deleteMovieById = async (movieId) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
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
  } else {
    return {
      error: `There was an error retrieving movie data. Please try again later.`,
    };
  }
};

// delete a comment by comment id value
module.exports.deleteCommentById = async (movieId, commentId) => {
  if (!validateId(movieId) || !validateId(commentId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
    const database = client.db(databaseName);
    const comments = database.collection(collections.comments);

    const deletionRules = { _id: ObjectId(commentId) };
    const result = await comments.deleteOne(deletionRules);

    return result.deletedCount === 1
      ? `Comment with id of ${commentId} successfully deleted.`
      : {
          error: `There was an error deleting this comment. Please try again later.`,
        };
  } else {
    return {
      error: `There was an error retrieving movie data. Please try again later.`,
    };
  }
};

// helper function to check for existence of movie in database
let movieExists = async (movieId) => {
  return await module.exports.getMovieById(movieId).error;
};

let validateId = (id) => {
  return ObjectId.isValid(id);
};
