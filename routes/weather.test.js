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
            expect(res.body.error).toBeDefined();
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
        it("should return an error message on error", async () => {
            weatherData.getByQuery.mockResolvedValue({error: "Sample error message"});

            const res = await request(server).get("/weather?minAirTemp=50");

            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe("POST /", () =>{
        it("should return the new movie on success", async () => {
            weatherData.create.mockResolvedValue({_id:"890", title:"One Day"});

            const res = await request(server).post("/weather");

            expect(res != null && typeof res === 'object').toEqual(true);
        });
        it("should return an error message if body is missing title", async () => {
            weatherData.create.mockResolvedValue({error: "Movies must have a title."});

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
