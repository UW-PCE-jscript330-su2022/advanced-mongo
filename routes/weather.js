const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

const bodyParser = require('body-parser');

// curl http://localhost:5000/weather/tfby
router.get("/:userCallLetters", async (req, res, next) => {
  let result = await weatherData.getByCallLetters(req.params.userCallLetters);


  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }
  res.status(resultStatus).send(result);
});

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


 // curl "http://localhost:5000/weather?callLetters=TFBY&sections=AG1"
router.get("/", async (req, res, next) => {
    console.log(req.query);
    let minAirTemp = req.query.minAirTemp;
    let maxAirTemp = req.query.maxAirTemp;
    let sections = req.query.sections;
    let callLetters = req.query.callLetters;

    // if undefined, write code to completely omit that key-val pair?
  let minUndef = () =>{
     if(minAirTemp === undefined){
     return {$exists:true}
    } else {
      return minAirTemp 
    }
  }

  let maxUndef = () =>{
    if (maxAirTemp === NaN){
      return {error: 'this val must be a Number'}
    }
    else if(maxAirTemp === undefined){
      return {$exists:true}
   } else {
     return {$gte: (parseFloat(minAirTemp)) }
   }
 }


 let secUndef = () =>{
  if(sections === undefined){
  return  {$exists:true}
 } else {
   return sections
 }
}

let callLettersUndef = () =>{
  if(callLetters === undefined){
  return {$exists:true}
 } else {
   return callLetters
 }
}

    // let result = await weatherData.searchWeather({minAirTemp : minUndef(), maxAirTemp: maxUndef(), sections: secUndef(), callLetters: callLettersUndef()});

    let result = await weatherData.searchWeather({sections: secUndef(), callLetters: callLettersUndef()});

    console.log(result);
    if(result.error){
      resultStatus = 422;
    } else {
      resultStatus = 200;
    }
    res.status(resultStatus).send(result);
  });


module.exports = router;