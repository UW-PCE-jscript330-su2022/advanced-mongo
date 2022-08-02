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
 //curl "http://localhost:5000/weather?minAirTemp=2&maxAirTemp=4"
router.get("/", async (req, res, next) => {
    let key = Object.keys(req.query);
    let vals = Object.values(req.query)
    console.log(key)
    console.log(vals)

    let airTemperature = req.query.airTemperature;
    let sections = req.query.sections;
    let callLetters = req.query.callLetters;
    let minAirTemp = {};
    let maxAirTemp = {};

  let airTemperatureFunc = () => {

    if (key.includes('minAirTemp') && key.includes('maxAirTemp')) {

      let airTempLastKey = key.pop()
      console.log(airTempLastKey)

      if (airTempLastKey === 'maxAirTemp') {
        let maxAirTempNum = parseFloat(vals[1]);
        let minAirTempNum = parseFloat(vals);
        if (typeof maxAirTempNum !== "number" && typeof minAirTempNum !== "number") {
          return { error: 'this val must be a Number' }
        }

        return { $gte: minAirTempNum, $lte: maxAirTempNum }
      } else if (airTempLastKey === 'minAirTemp') {
        let maxAirTempNum = parseFloat(vals);
        let minAirTempNum = parseFloat(vals[1]);

        if (typeof maxAirTempNum !== "number" && typeof minAirTempNum !== "number") {
          return { error: 'this val must be a Number' }
        }

        return { $gte: minAirTempNum, $lte: maxAirTempNum }
      }
    }

    if (key.includes('minAirTemp') && !key.includes('maxAirTemp')) {

      let minAirTempNum = parseFloat(vals);

      if (typeof minAirTempNum !== "number" ) {
        return { error: 'this val must be a Number' }
      }
      else if (minAirTempNum !== {} || minAirTempNum !== undefined) {
        return { $gte: minAirTempNum }
        }
    }

    if (key.includes('maxAirTemp')  && !key.includes('minAirTemp') ) {

      let maxAirTempNum = parseFloat(vals);

      if (typeof maxAirTempNum !== "number" ) {
        return { error: 'this val must be a Number' }
      }
      else if (maxAirTempNum !== {} || maxAirTempNum !== undefined) {
        return { $lte: maxAirTempNum }
        }
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

    let result = await weatherData.searchWeather({sections: secUndef(), callLetters: callLettersUndef(), "airTemperature.value": airTemperatureFunc() });

    // console.log(result);
    if(result.error){
      resultStatus = 422;
    } else {
      resultStatus = 200;
    }
    res.status(resultStatus).send(result);
  });


module.exports = router;