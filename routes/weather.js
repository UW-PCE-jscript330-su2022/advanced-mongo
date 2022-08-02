const { Router } = require("express");
const router = Router();

const weatherData = require('../dataInterface/weather');

// curl -s http://localhost:5000/weather
// curl -s http://localhost:5000/weather
router.get("/", async (req, res) => {
    const weatherEntries = await weatherData.getAll(
        req.query.minAirTemp,
        req.query.maxAirTemp,
        req.query.sections,
        req.query.callLetters
    )

    if(weatherEntries){
        res.status(200).send(weatherEntries)
    } else {
        // If weatherList is empty/null, something serious is wrong with the MongoDB connection.
        res.status(500).send({error: "Something went wrong. Please try again."})
    }
})

// curl http://loclahost:5000/weather/:callLetters
router.get("/:callLetters", async (req, res) => {
    const weatherEntries = await weatherData.getCallLetters(req.params.callLetters);
    let statusCode = null;
    
    if (weatherEntries.length === 0) {
        statusCode = 404;
    } else {
        statusCode = 200;
    }
    
    res.status(statusCode).send(weatherEntries);
})

// curl -X POST -H "Content-Type: application/json" -d '{"name":"Cinephile Cyprus", "text":"Wow!"}' http://localhost:5000/weather/
router.post("/", async (req, res) => {
    const weatherNewEntry = await weatherData.createWeatherEntry(req.body);
    let statusCode = null;
    
    if (weatherNewEntry.error) {
        statusCode = 404;
    } else {
        statusCode = 200;
    }
    res.status(statusCode).send(weatherNewEntry);
});

// curl -X DELETE http://loclahost:5000/weather/:id
router.delete("/:id", async (req, res) => {
    const deleteEntry = await weatherData.deleteWeatherEntry(req.params.id);
    let statusCode = null;
    
    if(deleteEntry.error){
        statusCode = 404;
    } else {
        statusCode = 200;
    }
    
    res.status(statusCode).send(deleteEntry);
})

module.exports = router;