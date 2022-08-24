const request = require("supertest");
const server = require("../server");
jest.mock("../dataInterface/movies")
const movieData = require("../dataInterface/movies")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      movieData.getAll.mockResolvedValue([{_id:"890", title: "One Day"}])
      //expect(false).toEqual(true);
      // check status code === 200
      // check if response body is an array
      const res = await request(server).get("/movies")
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toEqual(true)
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.error).not.toBeDefined()

    });
    it("should return an error message on error", async () => {
      // make a request
      // parse the response
      // expectations about the response

      movieData.getAll.mockResolvedValue(null)
      const res = await request(server).get("/movies")
      expect(res.statusCode).toEqual(500)
      expect(res.body.error).toBeDefined()

    });
  });

  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      movieData.getByIdOrTitle.mockResolvedValue([{_id:"573a1397f29313caabce8896", title: "One Day"}])
      const res = await request(server).get("/movies/573a1397f29313caabce8896")
      expect(res.statusCode).toEqual(200)
    });

    it("should return a 404 if an error is found", async () => {
      movieData.getByIdOrTitle.mockResolvedValue(null)
      const res = await request(server).get("/movies/573a1397f29313caabce69db")
      expect(res.statusCode).toEqual(404)

    });
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {

      movieData.create.mockResolvedValue({"newObjectId": "62df873237daba30cdf2602e", "message": "Item created! ID: 62df873237daba30cdf2602e"})
      const res = await request(server).post("/movies")
      expect(res.statusCode).toEqual(200);

    });

    it("should return an error message if body is missing title", async () => {
      movieData.create.mockResolvedValue({error: "Movies must have a title."})
      const res = await request(server).post("/movies")
      expect(res.statusCode).toEqual(400);
      // check status code 400
    });

    it("should return an error message if movie fails to be created", async () => {
      movieData.create.mockResolvedValue({error: "Something went wrong. Please try again."})
      const res = await request(server).post("/movies")
      expect(res.body.error).toBeDefined()

    });

  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({"_id": "62df8cfe33d248a8ed01b9dc", "title": "Trip to the Moon IVi", "plot": null})
      const res = await request(server).put("/movies/62df8cfe33d248a8ed01b9dc")
      expect(res.statusCode).toEqual(200);
      // check status code 200
    });
    it("should return an error if movie fails to be updated", async () => {
      movieData.updateById.mockResolvedValue({error: `Something went wrong. 0 movies were updated. Please try again.`})
      const res = await request(server).put("/movies/62df8cfe33d248a8ed01b9dc")
      expect(res.statusCode).toEqual(400);
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      movieData.deleteById.mockResolvedValue({message: `Deleted 1 movie.`})
      const res = await request(server).delete("/movies/573a1397f29313caabce8896")
      expect(res.statusCode).toEqual(200);
      // check status code 200
    });
    it("should return an error message if movie fails to be deleted", async () => {
      movieData.deleteById.mockResolvedValue({error: `Something went wrong. 0 movies were deleted. Please try again.`})
      const res = await request(server).delete("/movies/573a1397f29313caabce8896")
      expect(res.statusCode).toEqual(400);
    });
  });

  describe("GET /:id/comments", () =>{
    it("should return an array on success", async () => {
      movieData.getAllComments.mockResolvedValue([
          {"_id": "5a9427648b0beebeb695de8c",
            "name": "Thomas Green",
            "email": "thomas_green@fakegmail.com",
            "movie_id": "573a1398f29313caabcebc0b",
          }])

      const res = await request(server).get("/movies/573a1398f29313caabcebc0b/comments")
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toEqual(true)
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.error).not.toBeDefined()

    });
    it("should return an error message on error", async () => {
      // make a request
      // parse the response
      // expectations about the response

      movieData.getAllComments.mockResolvedValue(null)
      const res = await request(server).get("/movies/573a1398f29313caabcebc0b/comments")
      expect(res.statusCode).toEqual(500)
      expect(res.body.error).toBeDefined()

    });
  });

  describe("GET /:id/comments/:commentId", () =>{
    it("should return a single comment on success", async () => {
      movieData.getAComment.mockResolvedValue([{
        "_id": "62df745922ea6d641e865785",
        "post": "Trip to the Moon Forever Sucks third Comment",
        "movie_id": "573a1397f29313caabce8896",
        "date": "2022-07-26T04:58:01.072Z"
      }])
      const res = await request(server).get("/movies/573a1397f29313caabce8896/comments/000")
      expect(res.statusCode).toEqual(200)
    });

    it("should return a 404 if an error is found", async () => {
      movieData.getAComment.mockResolvedValue({error: `No comment found with identifier 0.`})
      const res = await request(server).get("/movies/573a1397f29313caabce69db/comments/000")
      expect(res.statusCode).toEqual(404)

    });
  });

  describe("POST /:id/comments", () =>{
    it("should return the new comment on success", async () => {

      movieData.createComment.mockResolvedValue({
        "newObjectId": "62df93c1f497479798d1af37",
        "message": "Comment created! ID: 62df93c1f497479798d1af37"
      })
      const res = await request(server).post("/movies/573a1397f29313caabce8896/comments")
      expect(res.statusCode).toEqual(200);

    });

    it("should return an error message if a comment fails to be created", async () => {
      movieData.createComment.mockResolvedValue({error: "Something went wrong. Please try again."})
      const res = await request(server).post("/movies/573a1397f29313caabce8896/comments")
      expect(res.body.error).toBeDefined()

    });

  });

  describe("DELETE /:id/comments/:commentId", () =>{
    it("should return a message on success", async () => {
      movieData.deleteCommentById.mockResolvedValue({message: `Deleted 1 comment.`})
      const res = await request(server).delete("/movies/573a1397f29313caabce8896/comments/000")
      expect(res.statusCode).toEqual(200);
      // check status code 200
    });
    it("should return an error message if comments fails to be deleted", async () => {
      movieData.deleteCommentById.mockResolvedValue({error: `Something went wrong. 0 comments were deleted. Please try again.`})
      const res = await request(server).delete("/movies/573a1397f29313caabce8896/comments/000")
      expect(res.statusCode).toEqual(400);
    });
  });

  describe("PUT /:id/comments/:commentId", () =>{
    it("should return the updated comment on success", async () => {
      movieData.updateCommentById.mockResolvedValue({
        "_id": "62df8cfe33d248a8ed01b9dc",
        "post": "Trip to the Moon Forever Sucks extra extra extra Comment",
        "movie_id": "573a1397f29313caabce8896",
        "date": "2022-07-26T05:22:23.673Z"
      })
      const res = await request(server).put("/movies/62df8cfe33d248a8ed01b9dc/comments/000")
      expect(res.statusCode).toEqual(200);
      // check status code 200
    });
    it("should return an error if movie fails to be updated", async () => {
      movieData.updateCommentById.mockResolvedValue({
        error: `Something went wrong. 0 comments were updated. Please try again.`})
      const res = await request(server).put("/movies/62df8cfe33d248a8ed01b9dc/comments/000")
      expect(res.statusCode).toEqual(400);
    });
  });

});
