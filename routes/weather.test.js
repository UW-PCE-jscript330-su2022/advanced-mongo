const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/weather");
const weatherData = require("../dataInterface/weather");

describe("/weather routes", () => {

  beforeEach(() => {

  });

  describe("GET /:userCallLetters", () =>{
    it("should return an array on success", async () => {
      weatherData.getByCallLetters.mockResolvedValue({callLetters:"TFBY"});

      const res = await request(server).get("/weather/:userCallLetters");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
        weatherData.getByCallLetters.mockResolvedValue({error: "Mock error"});

      const res = await request(server).get("/weather/:userCallLetters");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /", () =>{
    it("should create a new weather data on success", async () => {
      weatherData.create.mockResolvedValue({airTemperature: {value: 1, quality: 1}, callLetters: "ABCD", elevation: 1111});

      const res = await request(server).post("/weather");

      expect(res.statusCode).toEqual(201);

    });
    it("should return an error message if body is missing Call Letters", async () => {
      weatherData.create.mockResolvedValue({error: "Mock error"});

      const res = await request(server).post("/weather");

      expect(res.statusCode).toEqual(400);
    });
    it("should return an error message if movie fails to be created", async () => {
      weatherData.create.mockResolvedValue({error: "Mock error"});
      
      const res = await request(server).post("/weather");

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("GET /:userParams", () =>{
    it("should return an array on success via air temps", async () => {
      weatherData.searchWeather.mockResolvedValue({minAirTemp: 1, maxAirTemp: 4});

      const res = await request(server).get("/weather/");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an array on success via air temps and sections", async () => {
      weatherData.searchWeather.mockResolvedValue({sections: "ABC", minAirTemp: 1, maxAirTemp: 4});

      const res = await request(server).get("/weather/");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a 422", async () => {
        weatherData.searchWeather.mockResolvedValue({error: "Mock error"});

      const res = await request(server).get("/weather/");

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toBeDefined();
    });
  });


});