const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/weather");
const movieData = require("../dataInterface/weather")

describe("/weather routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      movieData.getAllComments.mockResolvedValue([{_id:"123", text: "comment"}]);

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getAllComments.mockResolvedValue(null);

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });
}