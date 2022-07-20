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
      expect(false).toEqual(true);
      // check status code === 200

    });

    it("should return a 404 if an error is found", async () => {
      expect(false).toEqual(true);
      // check status code === 200

    });

    // check status code === 404
    //
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      expect(false).toEqual(true);
      // check status code 200
    });

    it("should return an error message if body is missing title", async () => {
      expect(false).toEqual(true);
      // check status code 400
    });

    it("should return an error message if movie fails to be created", async () => {
      expect(false).toEqual(true);
      // check status code 400
    });


  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      expect(false).toEqual(true);
      // check status code 200
    });
    it("should return an error if movie fails to be updated", async () => {
      expect(false).toEqual(true);
      // check status code 400
    });

  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      expect(false).toEqual(true);
      // check status code 200
    });
    it("should return an error message if movie fails to be deleted", async () => {
      expect(false).toEqual(true);
      // check status code 400
    });


  });
});
