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

  describe("GET /:id/comments", () =>{
    it("should return an array on success", async () => {
      movieData.getAllComments.mockResolvedValue([{_id:"890", comment:"One Day"}]);

      const res = await request(server).get("/movies/890/comments");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getAllComments.mockResolvedValue(null);

      const res = await request(server).get("/movies/890/comments");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      movieData.getByIdOrTitle.mockResolvedValue({_id:"890", title:"One Day"});

      const res = await request(server).get("/movies/890");
      expect(res.statusCode).toEqual(200);

      expect(res.body != null && typeof res.body === 'object').toEqual(true);
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getByIdOrTitle.mockResolvedValue({error: `No item found with identifier.`});

      const res = await request(server).get("/movies/890");
      expect(res.statusCode).toEqual(404);

    });
  });

  describe("GET /:movieId/comment/:id", () =>{
    it("should return a single comment on success", async () => {
      movieData.getCommentById.mockResolvedValue({_id:"890", comment:"One Day"});

      const res = await request(server).get("/movies/890/comments/10");
      expect(res.statusCode).toEqual(200);

      expect(res.body != null && typeof res.body === 'object').toEqual(true);
    });
    it("should return a status code of 404 if comment not found", async () => {
      movieData.getCommentById.mockResolvedValue({error: `No item found with identifier.`});

      const res = await request(server).get("/movies/890/comments/10");
      expect(res.statusCode).toEqual(404);

    });
  });

  describe("POST /", () =>{

    it("should return the new movie on success", async () => {
      movieData.create.mockResolvedValue({_id:"890", title:"One Day"});

      const res = await request(server).post("/movies/890");

      expect(res != null && typeof res === 'object').toEqual(true);
    });
    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue({error: "Movies must have a title."});

      const res = await request(server).post("/movies/890");

      expect(res.error).toBeDefined();
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue({error: "Could not create object"});
      const res = await request(server).post("/movies/890");
      expect(res.error).toBeDefined();
    });
  });

  describe("POST /:movieId/comment/", () =>{

    it("should return the new comment on success", async () => {
      movieData.createComment.mockResolvedValue({_id:"890", comment:"One Day"});

      const res = await request(server).post("/movies/890/comment");

      expect(res != null && typeof res === 'object').toEqual(true);
    });
    /*
    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue({error: "Movies must have a title."});

      const res = await request(server).post("/movies/890/comment");

      expect(res.error).toBeDefined();
    });
    */

    it("should return an error message if comment fails to be created", async () => {
      movieData.create.mockResolvedValue({error: "Could not create object"});
      const res = await request(server).post("/movies/890/comment");
      expect(res.error).toBeDefined();
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({_id:"890", title:"One Day"});
      const res = await request(server).put("/movies/890");
      expect(res.body != null && typeof res.body === 'object').toEqual(true);
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateById.mockResolvedValue({error: "Could not update object"});
      const res = await request(server).put("/movies/890");
      expect(res.error).toBeDefined();
    });
  });

  describe("PUT /:movieId/comments/:id", () =>{
    it("should return the updated comment on success", async () => {
      movieData.updateCommentById.mockResolvedValue({_id:"890", comment:"Test Comment"});
      const res = await request(server).put("/movies/890/comments/27");
      expect(res.body != null && typeof res.body === 'object').toEqual(true);
    });
    it("should return an error message if comment fails to be updated", async () => {
      movieData.updateCommentById.mockResolvedValue({error: "Could not update object"});
      const res = await request(server).put("/movies/890/comments/27");
      expect(res.error).toBeDefined();
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteById.mockResolvedValue({message: "Deleted 1 movie."});
      const res = await request(server).delete("/movies/890");
      expect(res.body.message).toBeDefined();
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteById.mockResolvedValue({error: `error deleting movie`});
      const res = await request(server).delete("/movies/890");
      expect(res.error).toBeDefined();
    });
  });

    describe("GET /movies/genres/:genreName", () =>{
    it("should return an array of movies on success", async () => {
      movieData.getByGenre.mockResolvedValue([{_id:"890", title:"One Day"}])
      const res = await request(server).get("/movies/genres/Short");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an empty array if no movies match genre", async () => {
      movieData.getByGenre.mockResolvedValue([])
      res = await request(server).get("/movies/genres/UEOA921DI");

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(0);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getByGenre.mockResolvedValue({error: `Problem retrieving movies by genre`})

      res = await request(server).get("/movies/genres/Short");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

});
