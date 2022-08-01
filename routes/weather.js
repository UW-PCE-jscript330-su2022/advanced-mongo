const { Router } = require('express');
const router = Router();
const weatherData = require('../dataInterface/weather');

router.get('/', async (req, res) => {
  let resultStatus;
  const result = await weatherData.getWeatherByQuery(
    req.query.minAirTemp,
    req.query.maxAirTemp,
    req.query.section,
    req.query.callLetters
  );

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
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
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// route to create (POST) a new weather report
// curl -X POST -H "Content-Type: application/json" -d '{"st": "x+47600-047901", "ts": "2022-01-01T12:00:00.000Z", "position": {"type": "Point", "coordinates":[-48, 48]}, "elevation":1111, "callLetters":"xxxx", "qualityControlProcess":"X111", "dataSource":"0","type":"XX-11"}' http://localhost:5000/weather
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
