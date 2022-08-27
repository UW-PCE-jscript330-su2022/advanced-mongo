const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const auth = require('../auth');

  const uri =
  "mongodb+srv://cahilljm53:Mevin*80@cluster0.qlff5yn.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri);

const databaseName = 'sample_mflix';
const userCollName = 'users';

module.exports = {}

// GET ALL USERS
module.exports.getAll = async () => {
  const database = client.db(databaseName);
  const users = database.collection(userCollName);

  const query = {};
  let userCursor = await users.find(query);

  return userCursor.toArray();
}

// GET USER BY EMAIL
async function findByEmail(email){
  const database = client.db(databaseName);
  const users = database.collection(userCollName);

  const query = {email: email};
  let user = await users.findOne(query);
  return user;
}

// GET USER BY CREDENTIALS
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

//VERIFY USER
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const users = database.collection(userCollName);

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