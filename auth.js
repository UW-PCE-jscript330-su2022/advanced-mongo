const jwt = require('jsonwebtoken')

// Don't actually save this in a repo in a real project!!
const TOKEN_KEY = "rewiiofdjfiodparm"

module.exports.createToken = function(identifier){
  // create a token, return the jwt as a string
  const token = jwt.sign(
    {user_id: identifier},
    TOKEN_KEY
  )

  console.log("TOKEN: ", token)
  return token
}

module.exports.verifyToken = function(token){
  const decoded = jwt.verify(token, TOKEN_KEY)
  console.log("DECODED: ", decoded)
  return decoded
}