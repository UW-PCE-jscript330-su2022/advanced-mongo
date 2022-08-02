const request = require("supertest");
const server = require("../server");

// Declare the jest will mock weatherData. Must be before the require statement.
jest.mock("../dataInterface/weather");
const weatherData = require("../dataInterface/weather")

describe("/weather routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
        weatherData.getAll.mockResolvedValue([
            {_id:"1", callLetters:"ABCD"},
            {_id:"2", callLetters:"EFGH"},
            {_id:"3", callLetters:"IJKL"}
        ]);

        const res = await request(server).get("/weather");

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body.error).not.toBeDefined();
    });
    it("should return an error message on error", async () => {
        weatherData.getAll.mockResolvedValue(null);

        const res = await request(server).get("/weather");

        expect(res.statusCode).toEqual(500);
        expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /callLetters/:callLetters", () =>{
    it("should return weather entry with select callLetter on success", async () => {
        weatherData.getCallLetters.mockResolvedValue([
            {_id:"1", callLetters:"ABCD"},
            {_id:"2", callLetters:"EFGH"},
            {_id:"3", callLetters:"IJKL"}
        ]);

        const res = await request(server).get("/weather/ABCD");
        
        expect(res.statusCode).toEqual(200);
    });

    it("(CAN'T FIGURE THIS ONE OUT) should return 404 when it does not find sought callLetter value", async () => {
        weatherData.getCallLetters.mockResolvedValue([
            {_id:"1", callLetters:"ABCD"},
            {_id:"2", callLetters:"EFGH"},
            {_id:"3", callLetters:"IJKL"}
        ]);

        const res = await request(server).get("/weather/ZZZZ");

        expect(res.statusCode).toEqual(404);
    });
  });


    describe("POST /:id", () =>{
        it("should return a message on success", async () => {
            weatherData.createWeatherEntry.mockResolvedValue([
                {_id:"1", callLetters:"ABCD"},
                {_id:"2", callLetters:"EFGH"},
                {_id:"3", callLetters:"IJKL"}
            ]);

            const res = await request(server).post("/weather");

            expect(res.statusCode).toEqual(200);

        });
        it("should return a 404 message if weather entry fails.", async () => {
            weatherData.createWeatherEntry.mockResolvedValue({error: "did not work out well"})

            const res = await request(server).post("/weather");

            expect(res.statusCode).toEqual(404);
        });
    });
});