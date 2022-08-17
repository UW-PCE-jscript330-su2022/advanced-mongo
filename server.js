const express = require("express");

const routes = require("./routes");

const server = express();
server.use(express.json());

function logging(req, res, next){
    console.log(req.url)
    next()
}

server.use(logging)

server.use(routes);

module.exports = server;
