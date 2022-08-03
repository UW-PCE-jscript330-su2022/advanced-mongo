const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

// This route handles either id or title as an identifier.
// curl http://localhost:5000/movies/573a1390f29313caabcd4135
// curl http://localhost:5000/movies/Jurassic%20Park

router.get("/:callLetters", async (req, res, next) => {
    const result = await weatherData.getByCallLetters(req.params.callLetters)

    if(result.error){
        resultStatus = 422;
    } else {
        resultStatus = 200;
    }

    res.status(resultStatus).send(result);

});

router.get("/", async (req, res, next) => {

    const result = await weatherData.getByQuery(req.query)

    if(result.type && (result.type === "INVALID_QUERY_PARAMS" || result.type === "INVALID_QUERY_VALUE" || result.type === "NO_QUERY_PARAMS")){
        resultStatus = 422;
    } else if (result.type && result.type === "EXCEPTION")
    {
        resultStatus = 500;
    }
    else
    {
        resultStatus = 200;
    }

    res.status(resultStatus).send(result);

});

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
