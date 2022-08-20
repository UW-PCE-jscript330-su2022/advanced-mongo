const express = require("express");

const routes = require("./routes");
// server.use(name of middleware) is used to tell which middleware is run and in what order
const server = express();
const auth = require("./auth")

server.use(express.json());

function logging(req, res, next) {
console.log("Request received", req.url)

let testToken = auth.createToken("one@example.com")

auth.verifyToken(testToken)
next()
}



server.use(logging);
server.use(routes);

module.exports = server;