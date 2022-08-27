const express = require("express");

const routes = require("./routes");

const server = express();
server.use(express.json());

// Enable CORS
// From Ryan's contrib to freebikefinder, borrowed for my reference. 
// server.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET,HEAD,OPTIONS,POST,PUT,DELETE'
//   );
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   next();
// });

server.use(routes);

module.exports = server;