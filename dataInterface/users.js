const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const uri =
  "mongodb+srv://APIsuperuser:9RbwKvA8DpBkJgb9@cluster0.bwarser.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_mflix';
const collName = 'users';

module.exports = {}

async function findByEmail(email){
  const database = client.db(databaseName);
  const users = database.collection(collName);

  const query = {email: email};
  let user = await users.findOne(query);
  return user;
}

module.exports.findByCredentials = async (userObj) => {
  let user = await findByEmail(userObj.email)

  if(!user.password){ return {error: "User doesn't have password??"} }

  if(await bcrypt.compare(userObj.password, user.password)){
    let token = auth.createToken(user.email)
    return {message: "User logged in", token: token};
  } else {
    return {error: `No user found with email ${userObj.email}.`}
  }
}

// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const users = database.collection(collName);

  // validate that the user doesn't already exist in the database
  let alreadyExists = await findByEmail(newObj.email)
  if(alreadyExists){return {error:"This email is already in use"}}

  if(!newObj.email || !newObj.name || !newObj.password){
    // Invalid user object, shouldn't go in database.
    return {error: "Users must have a name, password, and email."}
  }

  let encryptedPassword = await bcrypt.hash(newObj.password, 10)
  let goodUser = {name: newObj.name, email: newObj.email, password: encryptedPassword}

  const result = await users.insertOne(goodUser);

  if(result.acknowledged){
    return { newObjectId: result.insertedId, message: `User created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}