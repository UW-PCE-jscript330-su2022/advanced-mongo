const { Router } = require("express");
const router = Router();
const weatherData = require("../dataInterface/weather")


// curl http://localhost:5000/weather/
// curl http://localhost:5000/weather?callLetters=VC81
router.get("/", async (req, res)=>{
  let status;
  let result = await weatherData.getQuery(req.query)
  // console.log(result )
  if(result !== null && result !== undefined && result.length > 0 ){
    status = 200
  }else{
    status = 400
    result = {ERROR: 'Failed to fetch data', STATUS: status}
  }
      // JSON.stringify() 
  // res.status(status).send(JSON.stringify(result, null, '\t'))
  res.status(status).json(result)
})

// callLetters is a field in the object 
// curl http://localhost:5000/weather/callLetters=VC81
// curl http://localhost:5000/weather/VC81
router.get("/:callLetters", async(req, res)=>{
  let status;
  let result = await weatherData.getByLetters(req.params.callLetters)
  if(result !== null && result !== undefined && result.length > 0){
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

  // // check for empty object
  // if(Object.keys(req.body).length === 0){
  //   status = 400
  //   result = {Error: "failed to create"}
  //   // res.status(status).send(JSON.stringify(result, null, '\t'))

  // }
  if(!result.Error){
    status = 200
  }else{
    status = 400
  }
  res.status(status).send(JSON.stringify(result, null, '\t'))
})
module.exports = router;

