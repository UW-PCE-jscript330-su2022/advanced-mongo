const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {

      movieData.getAll.mockResolvedValue([{_id:"890", title:"One Day"}]);
      const res = await request(server).get("/movies");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message on error", async () => {
      movieData.getAll.mockResolvedValue(null);

      const res = await request(server).get("/movies");
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();

    });
  });

  describe("GET /movies/:id/comments", () =>{
    it("should return a single movie on success", async () => {
      movieData.getAllComments.mockResolvedValue([{
        _id:"5a9427648b0beebeb69579f5",
        name:"John Bishop",
        email:"john_bishop@fakegmail.com",
        movie_id:"573a1390f29313caabcd446f",
        text:"Id error ab at molestias dolorum incidunt. Non deserunt praesentium do...",
        date:"1975-01-21T00:31:22.000+00:00"}]);

      const res = await request(server).get("/movies/5a9427648b0beebeb69579f5/comments");
      expect(res.statusCode).toEqual(200);
     expect(res.body.error).not.toBeDefined();

    });
    it("should return an empty array if movie not found", async () => {

     movieData.getAllComments.mockResolvedValue(null);
     const res = await request(server).get("/movies/573a1390c/comments");
     expect(res.body.length).toEqual(undefined);
      expect(res.body.error).not.toBeDefined();
    });
  });


  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      movieData.create.mockResolvedValue({"newObjectId":"62d63","message":"Item created! ID: 62d63"});
      const res = await request(server).post("/movies");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue({"error":"Movies must have a title."});
      const res = await request(server).post("/movies");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue(null);
      const res = await request(server).post("/movies");
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({_id: 123, title:"Update title"});
      const res = await request(server).put("/movies/123");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message if movie id is invalid or not found", async () => {
      movieData.updateById.mockResolvedValue({"error":"Something went wrong. 0 movies were updated. Please try again."});
      const res = await request(server).put("/movies/123");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateById.mockResolvedValue(null);
      const res = await request(server).put("/movies/123");
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });
  describe("DELETE/comments/:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteCommentById.mockResolvedValue([{
        _id:"5a9427648b0beebeb69579f5",
        name:"John Bishop",
        email:"john_bishop@fakegmail.com",
        movie_id:"573a1390f29313caabcd446f",
        text:"Id error ab at molestias dolorum incidunt. Non deserunt praesentium do...",
        date:"1975-01-21T00:31:22.000+00:00"
      }]);
      const res = await request(server).delete("/movies/comments/5a9427648b0beebeb69579f5");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body).not.toBeDefined();
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteCommentById.mockResolvedValue(null);
      const res = await request(server).post("/movies/comments/573a1390f29313caabcd446f");
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("GET /genres/:genreName", () =>{
    it("should return an array of movies on success", async () => {
      // TODO: Mock the correct data interface method
      movieData.getMoviesByGenre.mockResolvedValue([{_id: 123, genres: ["Short"], title: "Title testing"}]);
      const res = await request(server).get("/movies/genres/Short");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an empty array if no movies match genre", async () => {
      // TODO: Mock the correct data interface method
      movieData.getMoviesByGenre.mockResolvedValue({"error":"No movie found with the genre: UEOA921DI"});
      const res = await request(server).get("/movies/genres/UEOA921DI");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
    it("should return an error message on error", async () => {
      // TODO: Mock the correct data interface method
      movieData.getMoviesByGenre.mockResolvedValue(null);
      const res = await request(server).get("/movies/genres/Short");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

});