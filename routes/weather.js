const { Router } = require("express");
const router = Router();
const querystring = require('querystring');
const url = require*('url');

const weatherData = require('../dataInterface/weather');

//curl "http://localhost:5001/weather?callLetters=TFRB&minAirTemp=5&maxAirTemp=30&section=AG1"
// e.g.curl "http://localhost:5001/weather?minAirTemp=5&callLetters=TFRB"
router.get("/", async(req, res)=>{
  const result = await weatherData.getByQueryString(req.query)

  if(result.error){
    resultStatus = 422;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
})
  
  // curl http://localhost:5001/weather/average
  router.get("/average", async(req, res)=>{
    const result = await weatherData.getAverage()
  
    if(result.error){
      resultStatus = 422;
    } else {
      resultStatus = 200;
    }
  
    res.status(resultStatus).send(result);
  })

// curl -X POST -H "Content-Type: application/json" -d "{\"callLetters\":\"TFRB\", \"elevation\":\"9999\"}" http://localhost:5001/weather
  router.post("/", async (req, res, next) => {
    let resultStatus;
    let result = await weatherData.create(req.body);
  
    if(result.error){  
      resultStatus = 422;
    } else {
      resultStatus = 200;
    }
  
    res.status(resultStatus).send(result);
  });
  module.exports = router;
