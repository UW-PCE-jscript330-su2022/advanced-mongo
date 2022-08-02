const { Router } = require("express");
const router = Router();
const querystring = require('querystring');
const url = require*('url');

const weatherData = require('../dataInterface/weather');

//curl http://localhost:5001/weather/:callLetters
// e.g. curl http://localhost:5001/weather/VC81
router.get("/", async(req, res)=>{
  const result = await weatherData.getByQueryString(req.query)
  res.status(200).send(result);
})
  
module.exports = router;
