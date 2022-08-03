const { Router, response } = require("express");
const router = Router();

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const weatherData = require('../dataInterface/weather');

// GET WEATHER BY PARAMETER
// curl -sS "http://localhost:5001/weather?callLetters=VCSZ&sections=AG1&minAirTemp=-30.1&maxAirTemp=10"

router.get("/", async (req, res) => {
 
  let callLetters = req.query.callLetters;
  let sections = req.query.sections;
  let minAirTemp = req.query.minAirTemp;
  let maxAirTemp = req.query.maxAirTemp;

  let weatherList = await weatherData.getAll(callLetters,sections,minAirTemp,maxAirTemp);

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
// curl -sS -X POST -H "Content-Type: application/json" -d '{"elevation":"9999", "callLetters":"PLAT"}' http://localhost:5001/weather
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