const request = require("supertest");
const server = require("../server");
jest.mock("../dataInterface/weather")
const weatherData = require("../dataInterface/weather")

describe("/weather routes", () => {

    beforeEach(() => {

    });

    describe("GET /", () =>{
        it("should return an array on success", async () => {
            weatherData.getAll.mockResolvedValue([{_id:"890", callLetters: "PLAT"}])
            //expect(false).toEqual(true);
            // check status code === 200
            // check if response body is an array
            const res = await request(server).get("/weather")
            expect(res.statusCode).toEqual(200)
            expect(Array.isArray(res.body)).toEqual(true)
            expect(res.body).toBeInstanceOf(Array)
            expect(res.body.error).not.toBeDefined()

        });
        it("should return an error message on error", async () => {
            // make a request
            // parse the response
            // expectations about the response

            weatherData.getAll.mockResolvedValue(null)
            const res = await request(server).get("/weather")
            expect(res.statusCode).toEqual(500)
            expect(res.body.error).toBeDefined()

        });
    });

    describe("GET /:id", () =>{
        it("should return a weather array on success", async () => {
            weatherData.getByIdOrCallLetter.mockResolvedValue([{_id:"573a1397f29313caabce8896", callLetters: "PLAT"}])
            const res = await request(server).get("/weather/PLAT")
            expect(res.statusCode).toEqual(200)
        });

        it("should return a 404 if an error is found", async () => {
            weatherData.getByIdOrCallLetter.mockResolvedValue(null)
            const res = await request(server).get("/weather/PLAT")
            expect(res.statusCode).toEqual(404)

        });
    });
    //
    describe("POST /", () =>{
        it("should return a new weather object id on success", async () => {

            weatherData.create.mockResolvedValue({"newObjectId": "62df873237daba30cdf2602e", "message": "Item created! ID: 62df873237daba30cdf2602e"})
            const res = await request(server).post("/weather")
            expect(res.statusCode).toEqual(200);

        });

        it("should return an error message if body is missing air temperature value", async () => {
            weatherData.create.mockResolvedValue({error: "weather must have an air temperature value."})
            const res = await request(server).post("/weather")
            expect(res.statusCode).toEqual(400);
            // check status code 400
        });

        it("should return an error message if weather fails to be created", async () => {
            weatherData.create.mockResolvedValue({error: "Something went wrong. Please try again."})
            const res = await request(server).post("/weather")
            expect(res.body.error).toBeDefined()

        });

    });
    //

});
