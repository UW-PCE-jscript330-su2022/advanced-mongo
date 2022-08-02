const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');

const weatherData = require('../dataInterface/weather');

// curl http://localhost:5000/weather/VC81
router.get("/:callLetter", async (req, res) => {
  let result = await weatherData.getAllByCallLetter(req.params.callLetter);
  if(result){
    res.status(200).send(result);
  } else {
    // If result is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."});
  }
});

// curl 'http://localhost:5000/weather?minAirTemp=4'
// curl 'http://localhost:5000/weather?maxAirTemp=90'
// curl 'http://localhost:5000/weather?sections=AG1'
// curl 'http://localhost:5000/weather?callLetter=VC81'
// This compound command should return document _id 5553a998e4b02cf7151190c7 at a minimum (if only 1 query param is picked up; wrap url in quotes)
// curl 'http://localhost:5000/weather?minAirTemp=0&sections=AG1&maxAirTemp=1&callLetter=UUQR'
// '/' is all that's needed for path; '?' denotes query params, which are parsed by 'body-parser'. Multiple query params acceptable.
router.get("/", async (req, res) => {
  // Need validation for air temp being number (will come in as str, should be converted to num)
  let queryObj;
  if (!req.query) {
    res.status(404).send({error: "No query parameters found."});
  }
  if (req.query.minAirTemp) {
    let minAirTempValue = parseFloat(req.query.minAirTemp);
    // objName["keyName"] = valueName; <- creates key-value pair in objName
    queryObj["airTemperature.value"] = {$gte: minAirTempValue};
    console.log(queryObj);
  }
  if (req.query.maxAirTemp) {
    if (queryObj.airTemperature.value) {
      let maxAirTempValue = parseFloat(req.query.maxAirTemp);
      queryObj["airTemperature.value"] = {...queryObj, "airTemperature.value": $lte: maxAirTempValue};
      console.log(queryObj);
    }
  }
  
  const result = await weatherData.getByParameter(queryObj);

  if(result){
    res.status(200).send(result);
  } else {
    // If result is empty/null, something serious is wrong with the MongoDB connection.
    res.status(404).send({error: "Something went wrong. Please try again."});
  }
});

// No need to put quotes directly around braces (like this: "{}").
// curl -X POST -H "Content-Type: application/json" -d '{"airTemperature":{"value":10, "quality":"1"}, "sections":["AG1"], "callLetters":"NR40"}' http://localhost:5000/weather
router.post("/", async (req, res) => {
  let resultStatus;
  let result = await weatherData.createWeatherDocument(req.body);

  if(result){
    res.status(200).send(result);
  } else {
    // If result is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."});
  }

  // if(result.error){
  //   resultStatus = 404;
  // } else {
  //   resultStatus = 200;
  // }
  // res.status(resultStatus).send(result);
});

// REMEMBER TO PUT THIS IN!!!!!
module.exports = router;