const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
 
// _id:59b99db4cfa9a34dcd7885b6
// name:"Ned Stark"
// email:"sean_bean@gameofthron.es"
// password:"$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu"

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


// GET USER BY EMAIL CREDENTIAL
module.exports.findByCredentials = async (userObj) => {
  const database = client.db(databaseName);
  const users = database.collection(userCollName);

  const query = {email: userObj.email};
  let user = await users.findOne(query);

  if(user){
    return user;
  } else {
    return {error: `No user found with email ${userObj.email}.`}
  }
}

// CREATE/REGISTER A NEW USER
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const users = database.collection(userCollName);

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

