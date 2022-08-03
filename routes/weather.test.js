const request = require("supertest");
const server = require("../server");

// Declare the jest will mock movieData. Must be before the require statement.
jest.mock("../dataInterface/weather");
const weatherData = require("../dataInterface/weather")


describe("/weather routes", () => {

    beforeEach(() => {

    });

    describe("GET /:callLetters", () =>{
        it("should return an object on success", async () => {
            weatherData.getByCallLetters.mockResolvedValue({_id:"890", callLetters:"PLAT"});

            const res = await request(server).get("/weather/VC81");

            expect(res.statusCode).toEqual(200);
            expect(res.body != null && typeof res.body === 'object').toEqual(true);
            expect(res.body.error).not.toBeDefined();
        });
        it("should return an error message on error", async () => {
            weatherData.getByCallLetters.mockResolvedValue({error: "Sample error message"});

            const res = await request(server).get("/weather/VC81");

            expect(res.statusCode).toEqual(422);
            expect(res.body != null && typeof res.body === 'object').toEqual(true);
        });
    });

    describe("GET /", () =>{
        it("should return an array on success", async () => {
            weatherData.getByQuery.mockResolvedValue([{_id:"890", callLetters:"PLAT"}]);

            const res = await request(server).get("/weather?minAirTemp=50");

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toEqual(true);
            expect(res.body.error).not.toBeDefined();
        });
        it("should return an error type EXCEPTION on severe error", async () => {
            weatherData.getByQuery.mockResolvedValue({error: "Severe error", type: "EXCEPTION"});

            const res = await request(server).get("/weather?minAirTemp=50");

            expect(res.statusCode).toEqual(500);
            expect(res.body != null && res.body.type != null && res.body.type === 'EXCEPTION').toEqual(true);
        });
        it("should return an error type QUERY_NO_PARAMS if no query params provided", async () => {
            weatherData.getByQuery.mockResolvedValue({error: "Sample error message", type: "NO_QUERY_PARAMS"});

            const res = await request(server).get("/weather");

            expect(res.statusCode).toEqual(422);
            expect(res.body != null && res.body.type != null && res.body.type === 'NO_QUERY_PARAMS').toEqual(true);
        });
        it("should return an error type INVALID_QUERY_PARAMS if query params are not in minAirTemp, maxAirTemp, section, callLetters", async () => {
            weatherData.getByQuery.mockResolvedValue({error: "Sample error message", type: "INVALID_QUERY_PARAMS"});

            const res = await request(server).get("/weather?badparam=5");

            expect(res.statusCode).toEqual(422);
            expect(res.body != null && res.body.type != null && res.body.type === 'INVALID_QUERY_PARAMS').toEqual(true);
        });
        it("should return an error type INVALID_QUERY_VALUE if query params minAirTemp, maxAirTemp are not numbers", async () => {
            weatherData.getByQuery.mockResolvedValue({error: "Sample error message", type: "INVALID_QUERY_VALUE"});

            const res = await request(server).get("/weather?badparam=5");

            expect(res.statusCode).toEqual(422);
            expect(res.body != null && res.body.type != null && res.body.type === 'INVALID_QUERY_VALUE').toEqual(true);
        });
    });

    describe("POST /", () =>{
        it("should return the new movie on success", async () => {
            weatherData.create.mockResolvedValue({_id:"890", title:"One Day"});

            const res = await request(server).post("/weather");

            expect(res != null && typeof res === 'object').toEqual(true);
        });
        it("should return an error message if body is missing callLetters", async () => {
            weatherData.create.mockResolvedValue({error: "Weather data must have callLetters."});

            const res = await request(server).post("/weather");

            expect(res.error).toBeDefined();
        });
        it("should return an error message if movie fails to be created", async () => {
            weatherData.create.mockResolvedValue({error: "Could not create object"});
            const res = await request(server).post("/weather");
            expect(res.error).toBeDefined();
        });
    });
});
