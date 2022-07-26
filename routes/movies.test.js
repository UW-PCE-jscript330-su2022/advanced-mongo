const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies");
const { ObjectID } = require("bson");

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
    it("should return a single movie on success", async () => {
      movieData.getByIdOrTitle.mockResolvedValue([{_id:"890"}]);

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getByIdOrTitle.mockResolvedValue({error: "Mock error"});

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /:id/comments", () =>{
    it("should get all comments on success", async () => {
      movieData.getAllComments.mockResolvedValue([{_id:"890"}]);

      const res = await request(server).get("/movies/:id/comments");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getByIdOrTitle.mockResolvedValue({error: "Mock error"});

      const res = await request(server).get("/movies/:id");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toBeDefined();
    });
  });


  describe("GET /:commentId", () =>{
    it("should return a single comment on success", async () => {
      movieData.getSingleComment.mockResolvedValue([{_id:"890"}]);

      const res = await request(server).get("/movies/:movieId/comments/:commentId");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return a status code of 404 if movie not found", async () => {
      movieData.getSingleComment.mockResolvedValue({error: "Mock error"});

      const res = await request(server).get("/:movieId/comments/:commentId");

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).not.toBeDefined();
    });
  });


  describe("POST /", () =>{
    it("should create a new comment on success", async () => {
      movieData.createComment.mockResolvedValue({_id: "890"},{name :"Cinephile Cyprus", text :"Wow!"});

      const res = await request(server).post("/movies/:id/comments");

      expect(res.statusCode).toEqual(201);

    });
    it("should return an error message if body is missing title", async () => {
      movieData.createComment.mockResolvedValue({error: "Mock error"});

      const res = await request(server).post("/:id/comments");

      expect(res.statusCode).toEqual(404);
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.createComment.mockResolvedValue({error: "Mock error"});
      
      const res = await request(server).post("/:id/comments");

      expect(res.statusCode).toEqual(404);
    });
  });


  describe("POST /", () =>{
    it("should create a new movie on success", async () => {
      movieData.create.mockResolvedValue({title:"Llamas From Space", plot :"Aliens..."});

      const res = await request(server).post("/movies/");

      expect(res.statusCode).toEqual(201);

    });
    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue({error: "Mock error"});

      const res = await request(server).post("/movies/");

      expect(res.statusCode).toEqual(400);
    });
    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue({error: "Mock error"});
      
      const res = await request(server).post("/movies/");

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("PUT /:id", () =>{
    it("update a movie on success", async () => {
      movieData.updateById.mockResolvedValue([{_id:"890"}, {plot :"Sharks..."}]);

      const res = await request(server).put("/movies/:id");
  
      expect(res.statusCode).toEqual(201);
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateById.mockResolvedValue({error: "Mock error"});

      const res = await request(server).put("/movies/:id");
  
      expect(res.statusCode).toEqual(400);
    });
  });

  describe("PUT /:commentId", () =>{
    it("update a comment on success", async () => {
      movieData.updateCommentById.mockResolvedValue([{_id:"890"}, {name :"Migs", text: "My comment"}]);

      const res = await request(server).put("/movies/:movieId/comments/:commentId");
  
      expect(res.statusCode).toEqual(201);
    });
    it("should return an error message if movie fails to be updated", async () => {
      movieData.updateCommentById({error: "Mock error"});

      const res = await request(server).put("/:movieId/comments/:commentId");
  
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("DELETE /:id", () =>{
    it("should delete a movie on success", async () => {
      movieData.deleteById.mockResolvedValue({_id:"890"});

      const res = await request(server).delete("/movies/:id");
  
      expect(res.statusCode).toEqual(200);
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteById.mockResolvedValue({error: "Mock error"});

      const res = await request(server).delete("/movies/:id");

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("DELETE /:commentId", () =>{
    it("should delete a comment on success", async () => {
      movieData.deleteCommentById.mockResolvedValue([{_id:"890"}]);

      const res = await request(server).delete("/movies/:movieId/comments/:commentId");
  
      expect(res.statusCode).toEqual(200);
    });
    it("should return a error message if movie fails to be deleted", async () => {
      movieData.deleteCommentById.mockResolvedValue({error: "Mock error"});

      const res = await request(server).delete("/:movieId/comments/:commentId");
  
      expect(res.statusCode).toEqual(404);
    });
  });

  //   describe("GET /movies/genres/:genreName", () =>{
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