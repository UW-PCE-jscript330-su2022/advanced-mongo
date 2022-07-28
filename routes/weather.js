const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

// curl http://localhost:5001/weather
router.get("/", async (req, res, next) => {
    let weatherList = await weatherData.getAll()
  
    if(weatherList){
      res.status(200).send(weatherList)
    } else {
      // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
      res.status(500).send({error: "Something went wrong. Please try again."})
    }
  });

  // curl http://localhost:5001/weather/callLetters/VCSZ

router.get("/callLetters/:callLetters", async (req, res) => {
    let callLetter = await weatherData.getByCallLetters(req.params.callLetters)
    if (callLetter) {
        res.status(200).send(callLetter)
    } else {
        res.status(404).send({ error: `no item found with title ${req.params.callLetters}` });
    }
    
  });

  // curl -X POST -H "Content-Type: application/json" -d '{"elevation":1234, "dataSource":"4"}' http://localhost:5001/weather
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