const { Router, response } = require("express");
const router = Router();

const bodyParser = require('body-parser');
// const url = require('url');
// const querystring = require('querystring');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const weatherData = require('../dataInterface/weather');

// GET ALL WEATHER ENDPOINT
// curl -sS http://localhost:5001/weather
// router.get("/", async (req, res) => {
//     let weatherList = await weatherData.getAll()
  
//     if(weatherList){
//       res.status(200).send(weatherList)
//     } else {
//       // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
//       res.status(500).send({error: "Something went wrong. Please try again."})
//     }
//   });

// GET WEATHER BY PARAMETER (minAirTemp, maxAirTemp, sections, callLetters)
// curl -sS "http://localhost:5001/weather?callLetters=VCSZ&sections=AG1&minAirTemp=-3.1&maxAirTemp=10"
// curl -sS "http://localhost:5001/weather?callLetters=VCSZ"
router.get("/", async (req, res) => {
 
  let callLetters = req.query.callLetters;
  let sections = req.query.sections;
  let minAirTemp = req.query.minAirTemp;
  let maxAirTemp = req.query.maxAirTemp;
  

  console.log(req.query);

  let weatherList = await weatherData.getAll(callLetters,sections,minAirTemp,maxAirTemp);

  console.log(weatherList)

  if(weatherList){
    res.status(200).send(weatherList)
  } else {
    // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});


// GET WEATHER BY CALL LETTERS ENPOINT
// curl -sS http://localhost:5001/weather/callLetters/PLAT

router.get("/callLetters/:callLetters", async (req, res) => {
  let weatherCallLetter = await weatherData.getByCallLetters(req.params.callLetters)
  if (weatherCallLetter) {
      res.status(200).send(weatherCallLetter)
  } else {
      res.status(404).send({ error: `no item found with title ${req.params.callLetters}` });
  }

});

// POST WEATHER
// CREATE A NEW MOVIE
// curl -sS -X POST -H "Content-Type: application/json" -d '{"elevation":"9999", "callLetters":"PLAT"}' http://localhost:5001/weather
// curl -sS -X POST -H "Content-Type: application/json" -d '{"st": "x+48300-044400","ts": "1984-03-05T21:00:00.000Z","position": {"type": "Point","coordinates": [-44.4, 48.3] },"elevation": 9999,"callLetters": "VCSZ","qualityControlProcess": "V020","dataSource": "4","type": "FM-13","airTemperature": {"value": -3.1,"quality": "1","dewPoint": {"value": 999.9,"quality": "9"},"pressure": {"value": 1017.1,"quality": "1"},"wind": {"direction": {"angle": 999,"quality": "9"},"type": "9","speed": {"rate": 999.9,"quality": "9"}},"visibility": {"distance": {"value": 999999,"quality": "9"},"variability": {"value": "N","quality": "9"}},"skyCondition": {"ceilingHeight": {"value": 99999,"quality": "9","determination": "9"},"cavok": "N"},"sections": ["AG1"],"precipitationEstimatedObservation": {"discrepancy": "2","estimatedWaterDepth": 0}}' http://localhost:5001/weather
// new id created:62e18988b7cf924614483c36,  62e199807e735db7c97998ee
router.post("/", async (req, res) => {
  let resultStatus;
  let result = await weatherData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

module.exports = router;