const { Router } = require("express");
const router = Router();

const weatherReport = require('../dataInterface/weather');

router.get("/callLetters/:callLetter ", async(req, res, next) =>{
    const result = await weatherReport.getByCallLetters(req.params.callLetter);
    if (result) {
        res.status(200).send(result)
    } else {
        res.status(404).send({ error: `no weather found with this callLetter ${req.params.callLetter}` });
    }
})

router.post("/", async (req, res, next) => {
    let result = await weatherReport.create(req.body);
      if (result.error) {
        res.status(400).send(result);
      } else {
        res.status(200).send(result);
      }
  });

  router.get("/", async (req, res, next) => {

    let weatherList = await weatherReport.getAllWeatherReport(
        req.query.minAirTemp,
        req.query.maxAirTemp,
        req.query.section,
        req.query.callLetters)

    if(weatherList){
        res.status(200).send(weatherList)
    } else {
        res.status(500).send({error: "Something went wrong. Please try again."})
    }
});
  module.exports = router;