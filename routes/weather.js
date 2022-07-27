const { Router, response } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

// GET WEATHER ENDPOINT
// curl -sS http://localhost:5001/weather
router.get("/", async (req, res) => {
    let weatherList = await weatherData.getAll()
  
    if(weatherList){
      res.status(200).send(weatherList)
    } else {
      // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
      res.status(500).send({error: "Something went wrong. Please try again."})
    }
  });

// GET WEATHER BY ID ENDPOINT
// curl -sS http://localhost:5001/weather/62e18988b7cf924614483c36
router.get("/:id", async (req, res) => {
  let weatherList = await weatherData.getWeatherById()

  if(weatherList){
    res.status(200).send(weatherList)
  } else {
    // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// GET WEATHER BY CALL LETTERS ENPOINT
// curl -sS http://localhost:5001/weather/callLetters/PLAT

router.get("/callLetters/:callLetters", async (req, res, next) => {
  let weatherCallLetter = await weatherData.getByCallLetters(req.params.callLetters)
  if (weatherCallLetter) {
      res.status(200).send(weatherCallLetter)
  } else {
      res.status(404).send({ error: `no item found with title ${req.params.callLetters}` });
  }
  next()
});

// POST WEATHER
// CREATE A NEW MOVIE
// curl -sS -X POST -H "Content-Type: application/json" -d '{"elevation":"9999", "callLetters":"PLAT"}' http://localhost:5001/weather
// curl -sS -X POST -H "Content-Type: application/json" -d '{"st": "x+51900+003600","ts": "1984-03-05T14:00:00.000Z","position.type": "Point","position.coordinates": [3.6, 51.9],"elevation": 9999,"callLetters": "PLAT","qualityControlProcess": "V020","dataSource": "4","type": "FM-13","airTemperature.value": 4.4,"airTemperature.quality": "1","dewPoint.value": 3.5,"dewPoint.quality": "1","pressure.value": 1030.8,"pressure.quality": "1","wind.direction.angle": 200,"wind.direction.quality": "1","wind.type": "N","wind.speed.rate": 1,"wind.speedquality": "1","visibility.distance.value": 999999,"visibility.distance.quality": "9","variability.value": "N","variability.quality": "9","skyCondition.ceilingHeight.value": 99999,"skyCondition.ceilingHeight.quality": "9","skyCondition.ceilingHeight.determination": "9","skyCondition.cavok": "N","sections": ["AG1", "MD1", "OA1", "SA1", "UA1"],"precipitationEstimatedObservation.discrepancy": "2"}' http://localhost:5001/weather
// new id created:62e18988b7cf924614483c36,  62e199807e735db7c97998ee
router.post("/", async (req, res, next) => {
  let resultStatus;
  let result = await weatherData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// GET WEATHER BY PARAMETER (minAirTemp, maxAirTemp, section, callLetters)
// curl -sS http://localhost:5001/weather/?callLetter="PANT"
// router.get("/", async (req, res) => {
//   let weatherList = await weatherData.getAll()
//   let callLetter = req.query.callLetters

// if(weather[callLetter]) {
//   console.log (weather[callLetter])
//   // response.json(weather[callLetter])
// } else {
//   response.json('Not Found')
// }
//   // if(weatherList){
//   //   res.status(200).send(weatherList)
//   // } else {
//   //   // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
//   //   res.status(500).send({error: "Something went wrong. Please try again."})
//   // }
// });

module.exports = router;