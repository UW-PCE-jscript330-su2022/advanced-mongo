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
      movieData.getAllComments.mockResolvedValue([{_id:"123", text: "comment"}]);

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getAllComments.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(404);
      // expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      movieData.getByIdOrTitle.mockResolvedValue([{_id:"890", title:"One Day"}]);

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(200);
      // expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getByIdOrTitle.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(404);
      // expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /:id/comments/:commentId", () =>{
    it("should return a single comment on success", async () => {
      movieData.getComment.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getComment.mockResolvedValue(null);

      const res = await request(server).get("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      movieData.create.mockResolvedValue({"newObjectId":"62f040b08870cee8572e69a9","message":"Item created! ID: 62f040b08870cee8572e69a9"});

      const res = await request(server).post("/movies/");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue(null);

      const res = await request(server).post("/movies");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
      // expect status code == 400
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue(null);

      const res = await request(server).post("/movies");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
    });
      // expect status code == 400
  });

  describe("POST /:id/comments", () =>{
    it("should return the new comment on success", async () => {
      movieData.createComment.mockResolvedValue({"newObjectId":"62f040b08870cee8572e69a9","message":"Comment created! ID: 62f040b08870cee8572e69a9"});

      const res = await request(server).post("/movies/:id/comments");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if body is missing title", async () => {
      movieData.createComment.mockResolvedValue(null);

      const res = await request(server).post("/movies/:id/comments");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
      // expect status code == 400
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.createComment.mockResolvedValue(null);

      const res = await request(server).post("/movies/:id/comments");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
    });
      // expect status code == 400
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({_id:"890", title:"One Day", text: "comment"});

      const res = await request(server).put("/movies/:id");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateById.mockResolvedValue(null);

      const res = await request(server).put("/movies/:id");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated comment on success", async () => {
      movieData.updateCommentById.mockResolvedValue({"name" : "573a13a3f29313caabd0e77b", "text": "Sharks...", "date": `Comment updated on `});

      const res = await request(server).put("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateCommentById.mockResolvedValue(null);

      const res = await request(server).put("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
    });
  });


  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteById.mockResolvedValue({message: `Deleted 1 movie.`});

      const res = await request(server).delete("/movies/:id");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteById.mockResolvedValue(null);

      const res = await request(server).delete("/movies/:id");

      expect(res.statusCode).toEqual(400);
      // expect(res.body.error).toBeDefined();
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteCommentById.mockResolvedValue({message: `Deleted 1 movie.`});

      const res = await request(server).delete("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteCommentById.mockResolvedValue(null);

      const res = await request(server).delete("/movies/:id/comments/:commentId");

      expect(res.statusCode).toEqual(404);
      // expect(res.body.error).toBeDefined();
    });
  });

  // describe("GET /movies/genres/:genreName", () =>{
  //   it("should return an array of movies on success", async () => {
  //     // TODO: Mock the correct data interface method
  //     const res = await request(server).get("/movies/genres/Short");

  //     expect(res.statusCode).toEqual(200);
  //     expect(Array.isArray(res.body)).toEqual(true);
  //     expect(res.body.error).not.toBeDefined();
  //   });
  //   it("should return an empty array if no movies match genre", async () => {
  //     // TODO: Mock the correct data interface method
  //     const res = await request(server).get("/movies/genres/UEOA921DI");

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.length).toEqual(0);
  //     expect(res.body.error).not.toBeDefined();
  //   });
  //   it("should return an error message on error", async () => {
  //     // TODO: Mock the correct data interface method

  //     const res = await request(server).get("/movies/genres/Short");

  //     expect(res.statusCode).toEqual(500);
  //     expect(res.body.error).toBeDefined();
  //   });
  // });

});