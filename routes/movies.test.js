const request = require("supertest");
const server = require("../server");

//Define mock before require statement
jest.mock("../dataInterface/movies")
const movieData = require("../dataInterface/movies");

describe("/movies routes", () => {

  beforeEach(() => {
    
  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      // {title: "One"} is the (mocked) value we want the getAll method to return, to test behavior of our router code
      movieData.getAll.mockResolvedValue([{title: "Placeholder"}]);
      // This [call to the route handler] syntax is from supertest library, which allows us to make requests to server endpoints from test file(s): send request to server using .get method & /movies endpoint
      const res = await request(server).get('/movies');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message on error", async () => {
      movieData.getAll.mockResolvedValue(null);
      const res = await request(server).get('/movies');
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    })

  });

  describe("GET /:movieId/comments", () =>{
    it("should return an array on success", async () => {
      movieData.getAllComments.mockResolvedValue([{title: "Placeholder"}]);
      const res = await request(server).get('/movies/573a1390f29313caabcd4323/comments');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error code on error", async () => {
      movieData.getAllComments.mockResolvedValue(null);
      const res = await request(server).get('/movies/573a1390f29313caabcd432/comments');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("POST /:movieId/comments", () =>{
    it("should return a message on success", async () => {
      movieData.createComment.mockResolvedValue({title: "Placeholder"});
      const res = await request(server).get('/movies/573a1390f29313caabcd4323/comments');
      expect(res.statusCode).toEqual(200);
      expect(Object.entries(res.body)).toBeDefined();
    });
    it("should return an error message if body is missing title", async () => {
      //expect 400 status code
      expect(false).toEqual(true);
    });
    // Since we're testing the router, we should write tests that don't depend on/reference mongodb.
    it("should return an error message if movie fails to be created", async () => {
      //expect 400 status code
      expect(false).toEqual(true);
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if movie failes to be updated", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if movie failes to be deleted", async () => {
      expect(false).toEqual(true);
    });
  });
});