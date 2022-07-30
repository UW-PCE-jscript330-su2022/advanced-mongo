const { Router } = require("express");
// const { bodyParser } = require("body-parser")
// const { url } = require("url")
// const { querystring } = require("querystring")
const router = Router();

const weatherData = require('../dataInterface/weather');

// curl http://localhost:5000/weather
// router.get("/", async (req, res, next) => {
//     let weatherList = await weatherData.getAll()
//
//     if(weatherList){
//         res.status(200).send(weatherList)
//     } else {
//         // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
//         res.status(500).send({error: "Something went wrong. Please try again."})
//     }
// });

router.get("/", async (req, res, next) => {

    // let minAirTemp = req.query.minAirTemp;
    // let maxAirTemp = req.query.maxAirTemp;
    // let section = req.query.section;
    // let callLetters = req.query.callLetters;

    let weatherList = await weatherData.getAll(req.query.minAirTemp, req.query.maxAirTemp, req.query.section, req.query.callLetters)

    if(weatherList){
        res.status(200).send(weatherList)
    } else {
        // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
        res.status(500).send({error: "Something went wrong. Please try again."})
    }
});

// This route handles either id or title as an identifier.
// curl http://localhost:5000/weather/573a1390f29313caabcd4135
// curl http://localhost:5000/weather/PLAT
router.get("/:callLetter", async (req, res, next) => {
    //console.log(callLetter)
    //console.log(req.params.callLetter)
    const result = await weatherData.getByIdOrCallLetter(req.params.callLetter)

    if(result){
        resultStatus = 200;
    } else {
        resultStatus = 404;
    }
    res.status(resultStatus).send(result);


});

//query parameters

// router.get("/", async (req, res, next) => {
//     //console.log(callLetter)
//     //console.log(req.params.callLetter)
//     let minAirTemp = req.query.minAirTemp;
//     let maxAirTemp = req.query.maxAirTemp;
//     let section = req.query.section;
//     let callLetters = req.query.callLetter;
//     //console.log(callLetters)
//     const result = await weatherData.getByQueryParameters(minAirTemp, maxAirTemp, section, callLetters)
//
//     if(result){
//         resultStatus = 200;
//     } else {
//         resultStatus = 404;
//     }
//     res.status(resultStatus).send(result);
//
//
// });

// curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/weathers
router.post("/", async (req, res, next) => {
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










