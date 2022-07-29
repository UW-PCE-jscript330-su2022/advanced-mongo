////////////////////////////////////////////////////////////////////////////////
// /routes/weather.js //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

// curl http://localhost:5000/weather/VCSZ
router.get("/:callLetters", async (req, res, next) => {
  let weatherReports = await weatherData.getWeatherReportsByCallLetters(req.params.callLetters);
  if (!weatherReports){
    res.status(500).send({error: "Something went wrong. Please try again."});
  } else {
    res.status(200).send(weatherReports);
  }
});

// curl -X POST -H "Content-Type: application/json" -d '{"callLetters":"VCSZ", "elevation":"9999"}' http://localhost:5000/weather
router.post("/", async (req, res, next) => {
  let result = await weatherData.createWeatherReport(req.body);
  if (result.error){
    console.log(result);
    res.status(500).send(result);
  } else {
    res.status(200).send(result);
  }
});

// curl http://localhost:5000/weather?callLetters=VCSZ&minAirTemp=35
router.get("/", async (req, res, next) => {
  // Extract query parameters:
  const minAirTemp = req.query.minAirTemp;
  const maxAirTemp = req.query.maxAirTemp;
  const section = req.query.section;
  const callLetters = req.query.callLetters;
  let weatherReports = await weatherData.getWeatherReportsByQuery(minAirTemp, maxAirTemp, section, callLetters);
  if (weatherReports){
    res.status(200).send(weatherReports);
  } else {
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

module.exports = router;
