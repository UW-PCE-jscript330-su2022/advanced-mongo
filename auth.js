const jwt = require('jsonwebtoken')

// Don't save this in a repo in a real project
const TOKEN_KEY = "7UVTjJOrz9"

// generate a TokenExpiredError
module.exports.createToken = function(identifier) {
    // create a token return the jwt as a string
    const token = jwt.sign(
        { user_id: identifier },
        TOKEN_KEY,
        // { expiresIn: '1h' }
    )

    console.log("TOKEN: ", token)
    return token
}

// validate a token
module.exports.verifyToken = function (token) {
    const decoded = jwt.verify(token, TOKEN_KEY)
    console.log("DECODED: ", decoded)
    return decoded
}