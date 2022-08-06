const request = require("supertest");
const server = require("../server");

// the mock data should be define before the test
jest.mock("../dataInterface/weather")
const weatherData = require("../dataInterface/weather")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      weatherData.getAll.mockResolvedValue([{weather: 'Warm'}])
      const res = await request(server).get("/weather");
      console.log(res.body)
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true)
    });
  });

})