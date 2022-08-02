const { Router } = require('express');
const router = Router();
const weatherData = require('../dataInterface/weather');

router.get('/', async (req, res) => {
  let resultStatus;
  const result = await weatherData.getWeatherReports(
    req.query.minAirTemp,
    req.query.maxAirTemp,
    req.query.section,
    req.query.callLetters
  );

  if (result === null) {
    resultStatus = 500;
  } else if (result.length === 0) {
    resultStatus = 422;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Route to retrieve (GET) all movies from database
// curl http://localhost:5000/weather/vcsz
router.get('/:callLetters', async (req, res) => {
  let resultStatus;
  const result = await weatherData.getWeatherByCallLetters(
    req.params.callLetters
  );

  if (result === null) {
    resultStatus = 500;
  } else if (result.length === 0) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// route to create (POST) a new weather report
/*
  curl -X POST -H "Content-Type: application/json" -d '{"st":"x+51900+003600",
  "ts":"1984-03-05T14:00:00.000Z","position":{"type":"Point","coordinates":[3.6,51.9]},
  "elevation":9999,"callLetters":"TEST","qualityControlProcess":"V020","dataSource":"4",
  "type":"FM-13","airTemperature":{"value":4.4,"quality":"1"},"dewPoint":{"value":3.5,"quality":"1"},
  "pressure":{"value":1030.8,"quality":"1"},"wind":{"direction":{"angle":200,"quality":"1"},"type":"N","speed":{"rate":1,"quality":"1"}},
  "visibility":{"distance":{"value":999999,"quality":"9"},"variability":{"value":"N","quality":"9"}},
  "skyCondition":{"ceilingHeight":{"value":99999,"quality":"9","determination":"9"},"cavok":"N"},
  "sections":["AG1","MD1","OA1","SA1","UA1"],"precipitationEstimatedObservation":{"discrepancy":"2","estimatedWaterDepth":999},
  "atmosphericPressureChange":{"tendency":{"code":"2","quality":"1"},"quantity3Hours":{"value":0.9,"quality":"1"},
  "quantity24Hours":{"value":99.9,"quality":"9"}},"seaSurfaceTemperature":{"value":4.5,"quality":"9"},
  "waveMeasurement":{"method":"I","waves":{"period":4,"height":0.5,"quality":"9"},
  "seaState":{"code":"99","quality":"9"}}}' http://localhost:5000/weather
*/
router.post('/', async (req, res) => {
  let resultStatus;
  const result = await weatherData.createWeatherReport(req.body);

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

module.exports = router;
