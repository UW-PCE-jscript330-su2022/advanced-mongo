const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /movies", () =>{
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
    it("should return an array on success", async () => {
      movieData.getAllComments.mockResolvedValue([{_id:"123", text: "comment"}]);

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getAllComments.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /movies/:id", () =>{
    it("should return a single movie on success", async () => {
      movieData.getAll.mockResolvedValue([{_id:"890", title:"One Day"}]);

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getAll.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /movies/:id/comments/:commentId", () =>{
    it("should return a single comment on success", async () => {
      movieData.getComment.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getComment.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /movies", () =>{
    it("should return the new movie on success", async () => {
      movieData.getComment.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue(null);

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
      // expect status code == 400
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue(null);

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
      // expect status code == 400
  });

  describe("POST /movies/:id/comments", () =>{
    it("should return the new comment on success", async () => {
      movieData.getComment.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if body is missing title", async () => {
      movieData.createComment.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
      // expect status code == 400
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.createComment.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
      // expect status code == 400
  });

  describe("PUT /movies/:id", () =>{
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateById.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("PUT /movies/:id/comments/:commentId", () =>{
    it("should return the updated comment on success", async () => {
      movieData.updateCommentById.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateCommentById.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });


  describe("DELETE /movies/:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteById.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteById.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("DELETE /movies/:id/comments/:commentId", () =>{
    it("should return a message on success", async () => {
      movieData.deleteCommentById.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteCommentById.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
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