const { Router } = require("express");
const router = Router();
const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');

const weatherData = require('../dataInterface/weather');

// curl http://localhost:5000/weather?callLetters=VC81

// curl http://localhost:5000/weather?minAirTemp=5

// curl http://localhost:5000/weather?maxAirTemp=90

// curl http://localhost:5000/weather?sections=AG1&callLetters=VC81

// Should return up to 10 weather report objects where the air temperature was above 5 degrees.

// curl http://localhost:5000/weather?minAirTemp=5&maxAirTemp=90

// Should return up to 10 weather report objects where the air temperature was between 5 and 90 degrees.

// curl http://localhost:5000/weather?sections=AG1

// Should return up to 10 weather report objects where one of the sections was "AG1".

// curl http://localhost:5000/weather?callLetters=VC81&minAirTemp=35

// Should return up to 10 weather report objects where the call letters were "VC81" and the air temperature was above 35 degrees. 

router.get("/:callLetters", async (req, res, next) => {
    const result = await weatherData.getByCallLetters( req.params.callLetters);

    if(result.error){
        resultStatus = 422;
    } else {
        resultStatus = 200;
    }

    res.status(resultStatus).send(result);
});

router.get("/", async (req, res, next) => {
    const result = await weatherData.getByQuery( req.query.minAirTemp, req.query.maxAirTemp, req.query.sections, req.query.callLetters );

    if(result.error){
        resultStatus = 422;
    } else {
        resultStatus = 200;
    }

    res.status(resultStatus).send(result);
});

// curl -X POST -H "Content-Type: application/json" -d '{"airTemperature":{"value": 50}, "sections":"AG1", "callLetters":"VCSZ"}' http://localhost:5000/weather
router.post("/", async (req, res, next) => {
    let resultStatus;
    let result = await weatherData.create(req.body);
  
    if(result.error){
      resultStatus = 422;
    } else {
      resultStatus = 200;
    }
  
    res.status(resultStatus).send(result);
  });
  
module.exports = router;