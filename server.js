const express = require("express");

const routes = require("./routes");

const server = express();

const auth = require("./auth")


server.use(express.json());

// in cheri's file, let testToken and auth.verifyToken are missing

function logging(req, res, next){
    console.log("Request received: ", req.url)

    // let testToken = auth.createToken("one@example.com")
    // auth.verifyToken(testToken)
    next()
}

server.use(logging)

server.use(routes);

module.exports = server;
