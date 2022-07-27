const request = require("supertest");
const server = require("../server");

//declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/movies");
const movieData = require("../dataInterface/movies");

describe("/movies routes", () => {
  beforeEach(() => {
    describe("GET /", () =>{
      it("should return an array on success", async () => {
        movieData.getAll.mockResolvedValue({_id: "890", title: "one"});
        const res = await request(server).get("/movies");
        expect(res.statusCode).toEqual(200);
        //check response body is an array
        expect(res.body instanceof Array);
        expect(Array.isArray(res.body));
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
        //check status code == 200
        //check response body is an object
      });
    });
  
    describe("POST /", () =>{
      it("should return the new movie on success", async () => {
        expect(false).toEqual(true);
        //check status == 200
        //check response body is an object
      });
      it("should return an error message if body is missing title", async () => {
        expect(false).toEqual(true);
        //check status == 400
        //check response body is an object
      });
      it("should return an error message if movie failes to be created", async () => {
        expect(false).toEqual(true);
        //check status == 400
        //check response body is an object
      });
    });
  
    describe("PUT /:id", () =>{
      it("should return the updated movie on success", async () => {
        expect(false).toEqual(true);
        //check status == 200
        //check response body is an object
      });
    });
  
    describe("DELETE /:id", () =>{
      it("should return a message on success", async () => {
        expect(false).toEqual(true);
        //check status == 200
        //check response body is an object
      });
    });
  });
});
