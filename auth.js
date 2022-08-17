const jwt = require('jsonwebtoken')

const TOKEN_KEY = "yadayada"

module.exports.createToken = function(identifier){

    const token = jwt.sign(
        {user_id: identifier},
        TOKEN_KEY
    )

    console.log("TOKEN: ", token)
    return token

}

module.exports.verifyToken = function(req, res, next){
    const token = req.body.token || req.headers["x-access-token"]

    if(!token){
        return res.status(403).send("A token is required")
    }
    try{
        const decoded = jwt.verify(token, TOKEN_KEY)
        console.log("DECODED: ", decoded)
        req.user_id = decoded.user_id

    } catch (err){
        return res.status(401).send("Invalid Token")
    }
    next()

}
