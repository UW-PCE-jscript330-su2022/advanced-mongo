const { Router } = require('express');
const router = Router();
const weatherData = require('../dataInterface/weather');

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
