const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri =
  "mongodb+srv://APIsuperuser:9RbwKvA8DpBkJgb9@cluster0.bwarser.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_mflix';
const collName = 'users';

module.exports = {}

module.exports.findByCredentials = async (userObj) => {
  const database = client.db(databaseName);
  const users = database.collection(collName);

  const query = {email: userObj.email};
  let user = await users.findOne(query);

  if(user){
    return user;
  } else {
    return {error: `No user found with email ${userObj.email}.`}
  }
}


// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const users = database.collection(collName);

  // validate that it's a new user
  let alreadyExists = await module.exports.findByCredentials(newObj)
  if(!alreadyExists.error){return {error:"This email is already in use"}}

  if(!newObj.email || !newObj.name){
    // Invalid user object, shouldn't go in database.
    return {error: "Users must have a name and email."}
  }

  const result = await users.insertOne(newObj);

  if(result.acknowledged){
    return { newObjectId: result.insertedId, message: `User created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}