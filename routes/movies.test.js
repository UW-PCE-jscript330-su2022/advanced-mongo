const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () => {
    it("should return an array on success", async () => {
      movieData.getAll.mockResolvedValue([{ _id: "890", title: "One Day" }]);

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

  // describe("GET /:id", () =>{
  //   it("should return a single movie on success", async () => {
  //     expect(false).toEqual(true);
  //   });
  //   it("should return a status code of 404 if movie not found", async () => {
  //     expect(false).toEqual(true);
  //   });
  // });

  // describe("POST /", () =>{
  //   it("should return the new movie on success", async () => {
  //     expect(false).toEqual(true);
  //   });
  //   it("should return an error message if body is missing title", async () => {
  //     expect(false).toEqual(true);
  //     // expect status code == 400
  //   });
  //   it("should return an error message if movie fails to be created", async () => {
  //     expect(false).toEqual(true);
  //     // expect status code == 400
  //   });
  // });

  // describe("PUT /:id", () =>{
  //   it("should return the updated movie on success", async () => {
  //     expect(false).toEqual(true);
  //   });
  //   it("should return an error message if movie fails to be updated", async () => {
  //     expect(false).toEqual(true);
  //   });
  // });

  // describe("DELETE /:id", () =>{
  //   it("should return a message on success", async () => {
  //     expect(false).toEqual(true);
  //   });
  //   it("should return a error message if movie fails to be deleted", async () => {
  //     expect(false).toEqual(true);
  //   });
  // });

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

  describe("test get all comments for a movie GET /movies/:id/comments", () => {
    it("should return an array of comments on success", async () => {
      movieData.getAllComments.mockResolvedValue([{
        _id: "5a9427648b0beebeb6957d04",
        name: "Lori Blankenship",
        email: "lori_blankenship@fakegmail.com",
        movie_id: "573a1391f29313caabcd9688",
        text: "Totam delectus ullam exercitationem maiores. Praesentium velit veniam ...",
        date: "1974-08-06T06:47:37.000+00:00"
      }]);

      const res = await request(server).get("/movies/573a1391f29313caabcd9688/comments");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message on error", async () => {
      movieData.getAllComments.mockResolvedValue({});

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("test get a single comments for a movie GET /movies/:movieId/comments/:commentId", () => {
    it("should return a single comments on success", async () => {
      movieData.getOneComment.mockResolvedValue([{
        _id: "5a9427648b0beebeb6957d04",
        name: "Lori Blankenship",
        email: "lori_blankenship@fakegmail.com",
        movie_id: "573a1391f29313caabcd9688",
        text: "Totam delectus ullam exercitationem maiores. Praesentium velit veniam ...",
        date: "1974-08-06T06:47:37.000+00:00"
      }]);

      const res = await request(server).get("/movies/573a1391f29313caabcd9688/comments/5a9427648b0beebeb6957d04");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message on error", async () => {
      movieData.getOneComment.mockResolvedValue(null);

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("test create a comment for a movie POST /movies/:movieId/comments/:commentId", () => {
    it("should return an array of comments on success", async () => {
      movieData.createComment.mockResolvedValue([{
        // _id:"5a9427648b0beebeb6957d04",
        name: "Lori Smith",
        email: "lori_smith@fakegmail.com",
        movie_id: "573a1391f29313caabcd9688",
        text: "This movie was grand.",
        date: "2022-07-28T06:47:37.000+00:00"
      }]);

      const res = await request(server).post("/movies/573a1390f29313caabcd446f/comments");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message if movie id is invalid", async () => {
      movieData.createComment.mockResolvedValue({ "error": "The movie id provided is not a valid movie id. " });

      const res = await request(server).post("/movies/573a1390f29313caabcd445f/comments");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("test update a comment for a movie PUT /movies/:movieId/comments/:commentId", () => {
    it("should return the updated comment on success", async () => {
      movieData.updateCommentById.mockResolvedValue([{
      _id:"5a9427648b0beebeb6957d04",
      name:"Lori Blankenship",
      email:"lori_blankenship@fakegmail.com",
      movie_id:"573a1391f29313caabcd9688",
      text:"Not my favorite movie!",
      date:"1974-08-06T06:47:37.000Z"
    }]);

      const res = await request(server).put("/movies/573a1391f29313caabcd9688/comments/5a9427648b0beebeb6957d04");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message if an update does not occur", async () => {
      movieData.updateCommentById.mockResolvedValue({"error":"Something went wrong. 0 comments were updated. Please try again."}
      );

      const res = await request(server).put("/movies/573a1391f29313caabcd9688/comments/5a9427648b0beebeb6957d03");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("test delete a comment for a movie DELETE /movies/:movieId/comments/:commentId", () => {
    it("should return confirmation of the deletion on success", async () => {
      movieData.deleteCommentById.mockResolvedValue({"message":"Deleted 1 comment."});

      const res = await request(server).delete("/movies/573a1391f29313caabcd9688/comments/62e070b0055fb50d255d2796");

      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message if an deletion does not occur", async () => {
      movieData.deleteCommentById.mockResolvedValue({"error":"Something went wrong. 0 comments were deleted. Please try again."}
      );

      const res = await request(server).delete("/movies/573a1391f29313caabcd9688/comments/62e070b0055fb50d255d2795");
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

});