const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri =
  'mongodb+srv://Ryan:7Kvszal8Uz7Oqzok@cluster0.couuu.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);
const databaseName = 'sample_mflix';
const collection = 'movies';

module.exports = {};

// retrieve all movies from database
module.exports.getAllMovies = async () => {
  const database = client.db(databaseName);
  const collectionData = database.collection(collection);

  const query = {};
  let cursor = await collectionData
    .find(query)
    .project({ genre: 1 })
    .limit(10)
    .sort({ runtime: -1 });

  return cursor
    ? cursor.toArray()
    : {
        error: `There was an error retrieving movie data. Please try again later.`,
      };
};

// retrieve single movie by id from database
module.exports.getMovieById = async (movieId) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

  const database = client.db(databaseName);
  const movies = database.collection(collection);
  const query = { _id: ObjectId(movieId) };
  let movie = await collectionData.findOne(query);

  return movie
    ? movie
    : {
        error: `There was an error retrieving movie data. Please try again later.`,
      };
};

// retrieve movies that match a given genre
module.exports.getMoviesByGenre = async (genreName) => {
  const database = client.db(databaseName);
  const movies = database.collection(collection);
  let cursor = await collectionData
    .find({ genres: genreName })
    .limit(10)
    .project({ title: 1, genres: 1 });

  const result = await cursor.toArray();

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
module.exports.getMovieByTitle = async (title) => {
  const database = client.db(databaseName);
  const movies = database.collection(collection);
  const query = { title: title };
  let movie = await collectionData.findOne(query);

  return movie
    ? movie
    : {
        error: `There was an error retrieving movie data. Please try again later.`,
      };
};

// add new movie to database
module.exports.createMovie = async (newObj) => {
  const database = client.db(databaseName);
  const movies = database.collection(collection);

  if (!newObj.title) {
    // Invalid movie object, shouldn't go in database.
    return { error: 'Movies must have a title.' };
  }
  const result = await collectionData.insertOne(newObj);

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
module.exports.updateMovieById = async (movieId, newObj) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

  const database = client.db(databaseName);
  const movies = database.collection(collection);

  // Product team says only these two fields can be updated.
  const result = await collectionData.updateOne(
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

// delete a movie by movie id value
module.exports.deleteMovieById = async (movieId) => {
  if (!validateId(movieId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
    const database = client.db(databaseName);
    const movies = database.collection(collection);

    const deletionRules = { _id: ObjectId(movieId) };
    const result = await collectionData.deleteOne(deletionRules);

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

// helper function to check for existence of movie in database
let movieExists = async (movieId) => {
  return await module.exports.getMovieById(movieId).error;
};

let validateId = (id) => {
  return ObjectId.isValid(id);
};
