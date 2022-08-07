const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/weather");
const weatherData = require('../dataInterface/weather');

describe("/weather routes", () => {

  beforeEach(() => {

  });

  describe("GET /:callLetters", () =>{
    it("should return an array on success", async () => {
        weatherData.getByCallLetters.mockResolvedValue([{callLetters:"VCSZ", airTemperature: {value: -3.1}, sections: ["AG1"]}]);

        const res = await request(server).get("/weather/:callLetters");

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        // expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
        weatherData.getByCallLetters.mockResolvedValue(null);

        const res = await request(server).get("/weather/:callLetters");

        expect(res.statusCode).toEqual(422);
        // expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /?", () =>{
    it("should return an array on success", async () => {
        weatherData.getByQuery.mockResolvedValue([{callLetters:"VCSZ", airTemperature: {value: -3.1}, sections: ["AG1"]}]);

      const res = await request(server).get("/weather?");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
        weatherData.getByQuery.mockResolvedValue(null);

        const res = await request(server).get("/weather");

        expect(res.statusCode).toEqual(422);
        // expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /", () =>{
    it("should return the new post on success", async () => {
        weatherData.create.mockResolvedValue({"newObjectId":"62f03588086bbc8d555a6e38","message":"Item created! ID: 62f03588086bbc8d555a6e38"});

        const res = await request(server).post("/weather");
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if body is missing param", async () => {
        weatherData.create.mockResolvedValue({error: "Input must have valid air temperature, section, and call letters"});

        const res = await request(server).post("/weather");

        expect(res.statusCode).toEqual(422);
        expect(res.body.error).toBeDefined();
        // expect status code == 400
    }); 
  });   
});