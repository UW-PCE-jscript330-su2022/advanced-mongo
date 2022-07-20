const request = require("supertest");
const server = require("../server");

//Define mock before require statement
jest.mock("../dataInterface/movies")
const movieData = require("../dataInterface/movies");

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      // {title: "One"} is the (mocked) value we want the getAll method to return, *to test behavior of our router code*
      movieData.getAll.mockResolvedValue([{title: "One"}]);

      const res = await request(server).get('/movies');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
    });

    it("should return an error message on error", async () => {
      movieData.getAll.mockResolvedValue(null);

      const res = await request(server).get('/movies');
      
      expect(res.statusCode).toEqual(500);
    })

  });

  describe("GET /:id", () =>{
    it("should return a single movie on success", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if body is missing title", async () => {
      expect(false).toEqual(true);
      //expect 400 status code
    });
    it("should return an error message if movie fails to be created", async () => {
      expect(false).toEqual(true);
      //expect 400 status code
    });
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if movie failes to be updated", async () => {
      expect(false).toEqual(true);
    });
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success", async () => {
      expect(false).toEqual(true);
    });
    it("should return an error message if movie failes to be deleted", async () => {
      expect(false).toEqual(true);
    });
  });
});