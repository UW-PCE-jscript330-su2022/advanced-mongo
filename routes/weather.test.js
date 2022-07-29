////////////////////////////////////////////////////////////////////////////////
// /routes/weather.test.js /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Tests valid operation of /routes/weather.js.

const request = require("supertest");
const server = require("../server");

jest.mock("../dataInterface/weather");
const weatherData = require("../dataInterface/weather")

describe("/weather routes", () => {

  beforeEach(() => {

  });

  describe("GET /weather/:callLetters", () =>{
    it("should return an array of weather reports (limited to 10) on success", async () => {
      weatherData.getWeatherReportsByCallLetters.mockResolvedValue([{"_id":{"$oid":"5553a998e4b02cf7151190b8"},"st":"x+47600-047900","ts":{"$date":{"$numberLong":"447339600000"}},"position":{"type":"Point","coordinates":[{"$numberDouble":"-47.9"},{"$numberDouble":"47.6"}]},"elevation":{"$numberInt":"9999"},"callLetters":"VCSZ","qualityControlProcess":"V020","dataSource":"4","type":"FM-13","airTemperature":{"value":{"$numberDouble":"-3.1"},"quality":"1"},"dewPoint":{"value":{"$numberDouble":"999.9"},"quality":"9"},"pressure":{"value":{"$numberDouble":"1015.3"},"quality":"1"},"wind":{"direction":{"angle":{"$numberInt":"999"},"quality":"9"},"type":"9","speed":{"rate":{"$numberDouble":"999.9"},"quality":"9"}},"visibility":{"distance":{"value":{"$numberInt":"999999"},"quality":"9"},"variability":{"value":"N","quality":"9"}},"skyCondition":{"ceilingHeight":{"value":{"$numberInt":"99999"},"quality":"9","determination":"9"},"cavok":"N"},"sections":["AG1"],"precipitationEstimatedObservation":{"discrepancy":"2","estimatedWaterDepth":{"$numberInt":"999"}}}]);
      const res = await request(server).get("/weather/VCSZ");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      weatherData.getWeatherReportsByCallLetters.mockResolvedValue();
      const res = await request(server).get("/weather/VCSZ");
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /weather", () =>{
    it("should return the new weather report on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if body is missing call letters", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message on error", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("GET /weather?", () =>{
    it("should return an array of weather reports (limited to 10) matching valid query parameters", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if query parameters are invalid", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if movie fails to be created", async () => {
      expect(false).toEqual(true);
    });
  });

});

