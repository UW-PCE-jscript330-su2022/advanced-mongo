const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri =
  'mongodb+srv://Ryan:7Kvszal8Uz7Oqzok@cluster0.couuu.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);
const databaseName = 'sample_mflix';
const collection = 'comments';

module.exports = {};

// retrieve all movie comments from database
module.exports.getAllComments = async () => {
  const database = client.db(databaseName);
  const collectionData = database.collection(collection);

  const query = {};

  let cursor = await collectionData
    .find(query)
    .project({ text: 1 })
    .limit(10)
    .sort({ runtime: -1 });
  return cursor.toArray();
};

// retrieve one comment with unique comment id value
module.exports.getCommentById = async (commentId) => {
  if (!validateId(commentId)) {
    return { error: `Invalid id value. Please try again` };
  }

  if (!movieExists(movieId).error) {
    const database = client.db(databaseName);
    const comments = database.collection(collection);
    const query = { _id: ObjectId(commentId) };
    const result = await collectionData.findOne(query);

    console.log('result = ', result);

    return result
      ? result
      : {
          error: `There was an error retrieving comment data. Please try again later.`,
        };
  }
};

// update a comment by comment id value
module.exports.updateCommentById = async (commentId, commentText) => {
  if (!validateId(commentId)) {
    return { error: `Invalid id value. Please try again` };
  }

  const database = client.db(databaseName);
  const comments = database.collection(collection);

  let result = await collectionData.updateOne(
    { _id: ObjectId(commentId) },
    { $set: { text: commentText } }
  );

  return result.acknowledged
    ? module.exports.getCommentById(commentId)
    : {
        error: `There was an error updating comment data. Please try again later.`,
      };
};

// delete a comment by comment id value
module.exports.deleteCommentById = async (commentId) => {
  if (!validateId(commentId)) {
    return { error: `Invalid id value. Please try again` };
  }

  const database = client.db(databaseName);
  const comments = database.collection(collection);

  const deletionRules = { _id: ObjectId(commentId) };
  const result = await collectionData.deleteOne(deletionRules);

  return result.deletedCount === 1
    ? `Comment with id of ${commentId} successfully deleted.`
    : {
        error: `There was an error deleting this comment. Please try again later.`,
      };
};

// helper function to check for existence of movie in database
let movieExists = async (movieId) => {
  return await module.exports.getMovieById(movieId).error;
};

let validateId = (id) => {
  return ObjectId.isValid(id);
};
