const request = require("supertest");
const server = require("../server");

//declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies");

describe("/movies routes", () => {
  beforeEach(() => {
    
  });
  describe("GET /", () =>{
    it("should return an array on success", async () => {
      movieData.getAll.mockResolvedValue({_id: "890", title: "one"});
      const res = await request(server).get("/movies");
      expect(res.statusCode).toEqual(200);
      //check response body is an array
      expect(res.body instanceof Array);
      expect(Array.isArray(res.body));
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getAll.mockResolvedValue(null);
      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });
  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      //check status code == 200
      //check response body is an object
      movieData.getByIdOrTitle.mockResolvedValue({_id: "890", title: "one"});
      const res = await request(server).get("/movies/890");

      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      movieData.create.mockResolvedValue({_id: "890", title: "one"});
      const res = await request(server).post("/movies");

      //check response body is an object
      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
    it("should return an error message if body is missing title", async () => {
      //check status == 400
      //check response body is an object
      movieData.create.mockResolvedValue({error: "Movies must have a title."});
      const res = await request(server).post("/movies");

      //check response body is an object
      expect(res.statusCode).toEqual(400);
      expect(res.body instanceof Object);
    });
    it("should return an error message if movie failes to be created", async () => {
      //check status == 400
      //check response body is an object
      movieData.create.mockResolvedValue({error: "Something went wrong. Please try again."});
      const res = await request(server).post("/movies");

      //check response body is an object
      expect(res.statusCode).toEqual(400);
      expect(res.body instanceof Object);
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({_id: "890", title: "one"});
      const res = await request(server).put("/movies/:id");

      //check status == 200
      //check response body is an object
      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      //check response body is an object
      movieData.deleteById.mockResolvedValue({_id: "890", title: "one"});
      const res = await request(server).delete("/movies/:id");

      //check status == 200
      //check response body is an object
      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
  });
});  

//comment test start here
//declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/comments");
const commentData = require("../dataInterface/comments");

describe("/comments routes", () => {
  beforeEach(() => {
    
  });
  describe("GET /", () =>{
    it("should return an array on success", async () => {
      commentData.getAllComments.mockResolvedValue({movie_id: "890", text: "one"});
      const res = await request(server).get("/movies/:id/comments");
      expect(res.statusCode).toEqual(200);
      //check response body is an array
      expect(res.body instanceof Array);
      expect(Array.isArray(res.body));
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      commentData.getAllComments.mockResolvedValue({error: `No item found with the Id`});
      const res = await request(server).get("/movies/:id/comments");

      expect(res.body.error).toBeDefined();
    });
  });
  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      //check status code == 200
      //check response body is an object
      commentData.getCommentByCommentIdOrMovieId.mockResolvedValue({text: "one"});
      const res = await request(server).get("/movies/comments/:id");

      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      commentData.createComment.mockResolvedValue({text: "one"});
      const res = await request(server).post("/movies/:id/comments");

      //check response body is an object
      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
    it("should return an error message if body is missing text", async () => {
      //check status == 400
      //check response body is an object
      commentData.createComment.mockResolvedValue({error: "Comments must have a text and a movie id associated with it."});
      const res = await request(server).post("/movies/:id/comments");

      //check response body is an object
      expect(res.statusCode).toEqual(400);
      expect(res.body instanceof Object);
    });
    it("should return an error message if movie failes to be created", async () => {
      //check status == 400
      //check response body is an object
      commentData.createComment.mockResolvedValue({error: "Something went wrong. Please try again."});
      const res = await request(server).post("/movies");

      //check response body is an object
      expect(res.statusCode).toEqual(400);
      expect(res.body instanceof Object);
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated comment on success", async () => {
      commentData.updateCommentById.mockResolvedValue({text: "one"});
      const res = await request(server).put("/movies/comments/:id");

      //check status == 200
      //check response body is an object
      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      //check response body is an object
      commentData.deleteCommentById.mockResolvedValue({"_id": 890, "text": "test"});
      const res = await request(server).delete("/movies/comments/:id");

      //check status == 200
      //check response body is an object
      expect(res.statusCode).toEqual(200);
      expect(res.body instanceof Object);
    });
  });
});
//comment test end here

//genre test start here
describe("/Genre routes", () => {
  beforeEach(() => {
    
  });
  describe("GET /", () =>{
    it("should return an array on success", async () => {
      movieData.getMoviesByGenre.mockResolvedValue({_id: 890, genre: "Comedy", title: "one"});
      const res = await request(server).get("/movies/genres/Comedy");
      expect(res.statusCode).toEqual(200);
      //check response body is an array
      expect(res.body instanceof Array);
      expect(res.body.error).not.toBeDefined();
    });
  });
});
//genre test end here

//weather test starts here
//comment test start here
//declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/comments");
const weatherData = require("../dataInterface/weather");

describe("/weather routes", () => {
  beforeEach(() => {
    
  });
  describe("GET /", () =>{
    it("should return an array on success for get all", async () => {
      commentData.getAllComments.getAll);
      const res = await request(server).get("/weather");
      expect(res.statusCode).toEqual(200);
      //check response body is an array
      expect(res.body instanceof Array);
      expect(Array.isArray(res.body));
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      commentData.getAllComments.mockResolvedValue({error: `No item found with the query string`});
      const res = await request(server).get("/weather?section=tttt");
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toBeDefined();
    });
  });
});
//weather test ends here