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
      // weatherData.getAll.mockResolvedValue([{_id:"890", title:"One Day"}]);

      // const res = await request(server).get("/movies");
      // expect(res.statusCode).toEqual(200);
      // expect(Array.isArray(res.body)).toEqual(true);
      // expect(res.body.error).not.toBeDefined();
      expect(false).toEqual(true);
    });
    it("should return an error message on error", async () => {
      // weatherData.getAll.mockResolvedValue(null);

      // const res = await request(server).get("/movies");

      // expect(res.statusCode).toEqual(500);
      // expect(res.body.error).toBeDefined();
      expect(false).toEqual(true);
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