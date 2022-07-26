const request = require("supertest");
const server = require("../server");
jest.mock("../dataInterface/movies")
const movieData = require("../dataInterface/movies")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      movieData.getAll.mockResolvedValue([{_id:"890", title: "One Day"}])
      //expect(false).toEqual(true);
      // check status code === 200
      // check if response body is an array
      const res = await request(server).get("/movies")
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toEqual(true)
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.error).not.toBeDefined()

    });
    it("should return an error message on error", async () => {
      // make a request
      // parse the response
      // expectations about the response

      movieData.getAll.mockResolvedValue(null)
      const res = await request(server).get("/movies")
      expect(res.statusCode).toEqual(500)
      expect(res.body.error).toBeDefined()

    });
  });

  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      movieData.getByIdOrTitle.mockResolvedValue([{_id:"573a1397f29313caabce8896", title: "One Day"}])
      const res = await request(server).get("/movies/573a1397f29313caabce8896")
      expect(res.statusCode).toEqual(200)
    });

    it("should return a 404 if an error is found", async () => {
      movieData.getByIdOrTitle.mockResolvedValue(null)
      const res = await request(server).get("/movies/573a1397f29313caabce69db")
      expect(res.statusCode).toEqual(404)

    });
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {

      movieData.create.mockResolvedValue({"newObjectId": "62df873237daba30cdf2602e", "message": "Item created! ID: 62df873237daba30cdf2602e"})
      const res = await request(server).post("/movies")
      expect(res.statusCode).toEqual(200);

    });

    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue({error: "Movies must have a title."})
      const res = await request(server).post("/movies")
      expect(res.statusCode).toEqual(400);
      // check status code 400
    });

    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue({error: "Something went wrong. Please try again."})
      const res = await request(server).post("/movies")
      expect(res.body.error).toBeDefined()

    });

  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      expect(false).toEqual(true);
      // check status code 200
    });
    it("should return an error if movie fails to be updated", async () => {
      expect(false).toEqual(true);
      // check status code 400
    });

  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteById.mockResolvedValue({message: `Deleted 1 movie.`})
      const res = await request(server).delete("/movies/573a1397f29313caabce8896")
      expect(res.statusCode).toEqual(200);
      // check status code 200
    });
    it("should return an error message if movie fails to be deleted", async () => {
      movieData.deleteById.mockResolvedValue({error: `Something went wrong. 0 movies were deleted. Please try again.`})
      const res = await request(server).delete("/movies/573a1397f29313caabce8896")
      expect(res.statusCode).toEqual(400);
    });

  });
});
