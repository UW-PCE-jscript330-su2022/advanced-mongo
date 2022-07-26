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

  

  // describe("GET /:id", () => {
  //   it("should return a single movie on success", async () => {
  //     expect(false).toEqual(true);
  //   });
  //   it("should return a status code of 404 if movie not found", async () => {
  //     expect(false).toEqual(true);
  //   });
  // });

  // describe("POST /", () => {
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

  // describe("PUT /:id", () => {
  //   it("should return the updated movie on success", async () => {
  //     expect(false).toEqual(true);
  //   });
  //   it("should return an error message if movie fails to be updated", async () => {
  //     expect(false).toEqual(true);
  //   });
  // });

  // describe("DELETE /:id", () => {
  //   it("should return a message on success", async () => {
  //     expect(false).toEqual(true);
  //   });
  //   it("should return a error message if movie fails to be deleted", async () => {
  //     expect(false).toEqual(true);
  //   });
  // });

  // describe("GET /movies/genres/:genreName", () => {
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

  // Tests for new comment endpoints

  describe("GET /movies/:id/comments", () => {
    it("should return an array on success", async () => {
      movieData.getAllComments.mockResolvedValue([{
        "_id": "5a9427648b0beebeb69579f5",
        "name": "John Bishop",
        "email": "john_bishop@fakegmail.com",
        "movie_id": "573a1390f29313caabcd446f",
        "text": "Nothing beats Minions!",
        "date": "1975-01-21T00:31:22.000+00:00"
      }]);

      const res = await request(server).get("/movies/573a1390f29313caabcd446f/comments");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
  });


  describe("GET /:movieId/comments/:commentId", () => {
      it("should return a single comment on success", async () => {
        movieData.getOneComment.mockResolvedValue([{
          "_id": "5a9427648b0beebeb69579f5",
          "name": "John Bishop",
          "email": "john_bishop@fakegmail.com",
          "movie_id": "573a1390f29313caabcd446f",
          "text": "Nothing beats Minions!",
          "date": "1975-01-21T00:31:22.000+00:00"
        }]);
  
        const res = await request(server).get("/movies/573a1390f29313caabcd446f/comments/5a9427648b0beebeb69579f5");
  
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
    });
  
    describe("POST /:id/comments", () => {
      it("should return a single comment on success", async () => {
        movieData.createComment.mockResolvedValue([{
          "_id": "5a9427648b0beebeb69579f5",
          "name": "John Bishop",
          "email": "john_bishop@fakegmail.com",
          "movie_id": "573a1390f29313caabcd446f",
          "text": "Nothing beats Minions!",
          "date": "1975-01-21T00:31:22.000+00:00"
        }]);
  
        const res = await request(server).post("/movies/573a1390f29313caabcd446f/comments");
  
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
    });

    describe("PUT /:movieId/comments/:commentId", () => {
      it("should update a comment on success", async () => {
        movieData.updateComment.mockResolvedValue([{
          "_id": "5a9427648b0beebeb69579f5",
          "name": "John Bishop",
          "email": "john_bishop@fakegmail.com",
          "movie_id": "573a1390f29313caabcd446f",
          "text": "This movie is too old for me",
          "date": "1975-01-21T00:31:22.000+00:00"
        }]);
  
        const res = await request(server).put("/movies/573a1390f29313caabcd446f/comments/5a9427648b0beebeb69579f5");
  
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
      it("should return an error if not successful", async () => {
        movieData.updateComment.mockResolvedValue(null);

        const res = await request(server).post("/movies/573a1390f29313caabcd446f/comments/5a9427648b0beebeb69579f5");
  
        expect(res.statusCode).toEqual(404);
        
      });
    });

    describe("DELETE /:movieId/comments/:commentId", () => {
      it("should delete a single comment on success", async () => {
        movieData.deleteCommentById.mockResolvedValue([{
          "_id": "5a9427648b0beebeb69579f5",
          "name": "John Bishop",
          "email": "john_bishop@fakegmail.com",
          "movie_id": "573a1390f29313caabcd446f",
          "text": "Nothing beats Minions!",
          "date": "1975-01-21T00:31:22.000+00:00"
        }]);
  
        const res = await request(server).delete("/movies/573a1390f29313caabcd446f/comments/5a9427648b0beebeb69579f5");
  
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
      });
      it("should return an error if not successful", async () => {
        movieData.deleteCommentById.mockResolvedValue(null);

        const res = await request(server).post("/movies/573a1390f29313caabcd446f/comments/5a9427648b0beebeb69579f5");
  
        expect(res.statusCode).toEqual(404);
        
      });
    });
  
});