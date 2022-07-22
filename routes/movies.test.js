const request = require("supertest");
const server = require("../server");

// Declare that jest will mock movieData.  Must be before the require statement.

jest.mock("...dataInterface/movies")
const movieData = require("../dataInterface/movies")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      movieData.getAll.mockResolvedValue([{_id:"890", title:"One Day"}]);

      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
    it("should return an error message on error", async () => {
      // expect(false).toEqual(true);
      movieData.getAll.mockResolvedValue(null);
      const res = await request(server).get("/movies");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();
    });
  });

  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return a status code of 404 if not found", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return a 404 error message if body is missing title", async () => {
      expect(false).toEqual(true);
    });
    it("should return a 404 error message if movie fails to be created", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("PUT /:id", () =>{
    it("should return a message on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error code 400 if a record is not updated", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if the deletion fails", async () => {
      expect(false).toEqual(true);
    });
  });
});