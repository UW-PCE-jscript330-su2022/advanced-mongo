const express = require("express");

const routes = require("./routes");
// server.use(name of middleware) is used to tell which middleware is run and in what order
const server = express();

server.use(express.json());

function logging(req, res, next) {
console.log("Request received", req.url)
next()
}
server.use(logging);

server.use(routes);

module.exports = server;