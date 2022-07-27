const { Router } = require("express");
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

// GET WEATHER BY PARAMETER (minAirTemp, maxAirTemp, section, callLetters)
// curl -sS http://localhost:5001/weather/callLetters/PLAT

// router.get("/callLetters/:callLetters", async (req, res) => {
//     let weatherList = await weatherData.getByCallLetters()
  
//     if(weatherList){
//       res.status(200).send(weatherList)
//     } else {
//       // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
//       res.status(500).send({error: "Something went wrong. Please try again."})
//     }
//   });

  router.get("/callLetters/:callLetters", async (req, res, next) => {
    let weatherCallLetter = await weatherData.getByCallLetters(req.params.callLetters)
    if (weatherCallLetter) {
        res.status(200).send(weatherCallLetter)
    } else {
        res.status(404).send({ error: `no item found with title ${req.params.callLetters}` });
    }
    next()
});

// GET WEATHER BY CALL LETTERS ENPOINT


// POST WEATHER


module.exports = router;