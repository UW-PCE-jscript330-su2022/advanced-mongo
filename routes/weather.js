const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

const bodyParser = require('body-parser');

// curl http://localhost:5000/weather/tfby
// router.get("/:userCallLetters", async (req, res, next) => {
//   let result = await weatherData.getByCallLetters(req.params.userCallLetters);

//   if(result.error){
//     resultStatus = 404;
//   } else {
//     resultStatus = 200;
//   }
//   res.status(resultStatus).send(result);
// });

// curl -X POST -H "Content-Type: application/json" -d '{"airTemperature": {"value":"-5.1", "quality": "1"}, "callLetters":"SCGB", "elevation":"9999"}' http://localhost:5000/weather
router.post("/", async (req, res, next) => {
    let resultStatus;
    let result = await weatherData.create(req.body);
  
    if(result.error){
      resultStatus = 400;
    } else {
      resultStatus = 201;
    }
  
    res.status(resultStatus).send(result);
  });


 // curl http://localhost:5000/weather?minAirTemp=5
router.get("/", async (req, res, next) => {
    console.log("hi");
    console.log(req.query);
    let result = await weatherData.searchWeather(req.query);
    if(result.error){
      resultStatus = 404;
    } else {
      resultStatus = 200;
    }
    res.status(resultStatus).send(result);
  });


module.exports = router;