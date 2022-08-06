const { Router } = require("express");
const router = Router();
const weatherData = require("../dataInterface/weather")

router.get("/", async (req, res)=>{
  let status;
  let result = await weatherData.getQuery(req.query)
  if(result !== null && result !== undefined && result.length > 1 ){
    status = 200
  }else{
    status = 400
    result = {ERROR: 'Failed to fetch data', STATUS: status}
  }
  res.status(status).send(JSON.stringify(result, null, '\t'))
})


router.get("/:callLetters", async(req, res)=>{
  let status;
  let result = await weatherData.getByLetters(req.params.callLetters.toString())
  if(result.length > 1 ){
    status = 200
  }else{
    status = 400
    result = {ERROR: 'Failed to fetch data', STATUS: status}
  }
  res.status(status).send(result)
  return 1
})

// curl -X POST -H "Content-Type: application/json" -d '{"Weather":"Cloudy", "airTemp":"79F"}' http://localhost:5000/weather
router.post('/', async(req, res)=>{
  let status;
  let result = await weatherData.create(req.body)
  if(Object.keys(req.body).length === 0){
    status = 400
    result = {Error: "failed to create"}
    res.status(status).send(JSON.stringify(result, null, '\t'))

  }
  if(result){
    status = 200
  }else{
    status = 400
  }
  res.status(status).send(JSON.stringify(result, null, '\t'))
})
module.exports = router;

