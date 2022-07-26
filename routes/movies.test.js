const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies");
const { restart } = require("nodemon");

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

  describe("GET /:id", () =>{
    it("should return a single movie on success - by id", async () => {
        movieData.getByIdOrTitle.mockResolvedValue([
            {_id: "100", title: "The Boring Video"},
            {_id: "200", title: "The Exciting Video"}
        ]);

        const req = await request(server).get("/movies/100");
        console.log(req.body);

        expect(req.statusCode).toEqual(200);
        expect(req.body.length).toEqual(1);
        expect(req.body.error).not.toBeDefined();
    });
    it("should return a single movie on success - by title", async () => {
        movieData.getByIdOrTitle.mockResolvedValue([
            {_id: "100", title: "The Boring Video"},
            {_id: "200", title: "The Exciting Video"}
        ]);

        const res = await request(server).get("/movies/The%20Exciting%20Video");

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1)
        expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
        movieData.getByIdOrTitle.mockResolvedValue([
            {_id: "100", title: "The Boring Video"},
            {_id: "200", title: "The Exciting Video"}
        ]);

        const res = await request(server).get("/movies/300");

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBeDefined();
    });
  });



  describe("GET /:id/:comments", () => {
    it("should return a single comment from a specified movie on success", async () => {
        movieData.getCommentById.mockResolvedValue([{movie_id: "100", _id: "000"}]);

        const res = await request(server).get('/movies/100/000');
        expect(res.statusCode).toEqual(200);
    });
    it("should return a status of code 404 if either movie id or comment id is not found", async () => {
        movieData.getCommentById.mockResolvedValue([{movie_id: "100", _id: "100"}]);

        const res = await request(server).get('/movies/222/222');
        expect(res.statusCode).toEqual(404);
    })
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if body is missing title", async () => {
      expect(false).toEqual(true);
      // expect status code == 400
    });
    it("should return an error message if movie fails to be created", async () => {
      expect(false).toEqual(true);
      // expect status code == 400
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if movie fails to be updated", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return a error message if movie fails to be deleted", async () => {
      expect(false).toEqual(true);
    });
  });

    describe("GET /movies/genres/:genreName", () =>{
    it("should return an array of movies on success", async () => {
      // TODO: Mock the correct data interface method
      const res = await request(server).get("/movies/genres/Short");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an empty array if no movies match genre", async () => {
      // TODO: Mock the correct data interface method
      const res = await request(server).get("/movies/genres/UEOA921DI");

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(0);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      // TODO: Mock the correct data interface method

      const res = await request(server).get("/movies/genres/Short");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

});