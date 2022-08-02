const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

//curl http://localhost:5001/weather/:callLetters
// e.g. curl http://localhost:5001/weather/VC81
router.get("/weather/:callLetters", async(req, res)=>{
  const result = await weatherData.getAll(req.params.callLetter)
  res.status(200).send(result);
})

module.exports = router;
