const { Router } = require("express");
const router = Router();
const querystring = require('querystring');
const url = require*('url');

const weatherData = require('../dataInterface/weather');

//curl "http://localhost:5001/weather?callLetters=TFRB&minAirTemp=5&maxAirTemp=30&section=AG1"
// e.g.curl "http://localhost:5001/weather?minAirTemp=5&callLetters=TFRB"
router.get("/", async(req, res)=>{
  const result = await weatherData.getByQueryString(req.query)
  console.log(req.query);
  res.status(200).send(result);
})
  
module.exports = router;
