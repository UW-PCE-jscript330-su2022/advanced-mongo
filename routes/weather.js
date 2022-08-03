const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');


// This route handles callLetters as an identifier.
// curl http://localhost:5000/weather?minAirTemp=5

// Should return up to 10 weather report objects where the air temperature was above 5 degrees.
router.get("/:callLetters", async (req, res, next) => {
    const result = await weatherData.getByCallLetter(req.params.id)

    if(result.error){
        resultStatus = 422;
    } else {
        resultStatus = 200;
    }

    res.status(resultStatus).send(result);

});


module.exports = router;