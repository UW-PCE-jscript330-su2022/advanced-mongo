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

  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return a status code of 404 if movie not found", async () => {
      expect(false).toEqual(true);
    });
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

  describe("GET /movies/:id/comments", () => {
    it("should return an array of comments on success", async () => {
      movieData.getAllComments.mockResolvedValue([{
        "_id":"5a9427648b0beebeb69579e7",
        "name":"Mercedes Tyler",
        "email":"mercedes_tyler@fakegmail.com",
        "movie_id":"573a1390f29313caabcd4323",
        "text":"Eius veritatis vero facilis quaerat fuga temporibus. Praesentium expedita sequi repellat id. Corporis minima enim ex. Provident fugit nisi dignissimos nulla nam ipsum aliquam.",
        "date":"2002-08-18T04:56:07.000Z"
      }]);
      const res = await request(server).get("/movies/573a1390f29313caabcd4323/comments");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.getAllComments.mockResolvedValue({error: "Something went wrong. Please try again."});
      const res = await request(server).get("/movies/573a1390f29313caabcd4328/comments");
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /movies/comments/:id", () => {
    it("should return a comment on success", async () => {
      movieData.getCommentById.mockResolvedValue({
        "_id":"5a9427648b0beebeb69579e7",
        "name":"Mercedes Tyler",
        "email":"mercedes_tyler@fakegmail.com",
        "movie_id":"573a1390f29313caabcd4323",
        "text":"Eius veritatis vero facilis quaerat fuga temporibus. Praesentium expedita sequi repellat id. Corporis minima enim ex. Provident fugit nisi dignissimos nulla nam ipsum aliquam.",
        "date":"2002-08-18T04:56:07.000Z"
      });
      const res = await request(server).get("/movies/comments/5a9427648b0beebeb69579e7");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async() => {
      movieData.getCommentById.mockResolvedValue({error: "Something went wrong. Please try again."});
      const res = await request(server).get("/movies/comments/5a9427648b0beebeb69579e8");
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("POST /movies/:id/comments", () => {
    it("should return the new comment on success", async () => {
      movieData.createComment.mockResolvedValue({
        "newObjectId":"62dc519ad71f732ded684f4a",
        "message":"Comment created! ID: 62dc519ad71f732ded684f4a"
      });
      const res = await request(server).post("/movies/573a1390f29313caabcd42e8/comments");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async() => {
      movieData.createComment.mockResolvedValue({
        "error":"No item found with identifier 573a1390f29313caabcd4abc."
      });
      const res = await request(server).post("/movies/5a9427648b0beebeb6957abc/comments");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    })
  });

  describe("PUT /movies/comments/:id", () => {
    it("should return the newly updated comment on success", async () => {
      movieData.updateCommentById.mockResolvedValue({
        "_id":"5a9427648b0beebeb69579e7",
        "name":"Mercedes Tyler",
        "email":"mercedes_tyler@fakegmail.com",
        "movie_id":"573a1390f29313caabcd4323",
        "text":"Great movie!",
        "date":"2002-08-18T04:56:07.000Z"
      });
      const res = await request(server).put("/movies/comments/5a9427648b0beebeb69579e7");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async() => {
      movieData.updateCommentById.mockResolvedValue({
        "error":"Something went wrong. 0 comments were updated. Please try again."
      });
      const res = await request(server).put("/movies/comments/5a9427648b0beebeb6957abc");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    })
  });

  describe("DELETE /movies/:movieId/comments/:commentId", () => {
    it("should return a message on success", async () => {
      movieData.deleteCommentById.mockResolvedValue({
        "message":"Deleted 1 comment."
      });
      const res = await request(server).delete("/movies/573a1390f29313caabcd42e8/comments/62dc6465960412f0ccd909c8");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
      movieData.deleteCommentById.mockResolvedValue({
        "error":"Something went wrong. 0 movies were deleted. Please try again."
      });
      const res = await request(server).delete("/movies/573a1390f29313caabcd42e8/comments/62dc6465960412f0ccd90abc");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

});