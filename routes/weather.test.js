const request = require("supertest");
const server = require("../server");

// Declare the jest will mock weatherData. Must be before the require statement.
jest.mock("../dataInterface/weather");
const weatherData = require("../dataInterface/weather")

describe("/weather routes", () => {

    beforeEach(() => {

    });

    describe("TEST GET WEATHER BY PARAMETER GET /", () => {
        it("should return an array on success", async () => {
            weatherData.getAll.mockResolvedValue([{
                "_id": "5553a998e4b02cf715119a97",
                "st": "x+48300-044400",
                "ts": "1984-03-05T21:00:00.000Z",
                "position": {
                    "type": "Point",
                    "coordinates": [-44.4, 48.3] 
                },
                "elevation": 9999,
                "callLetters": "VC81",
                "qualityControlProcess": "V020",
                "dataSource": "4",
                "type": "FM-13",
                "airTemperature": {
                    "value": -4.7,
                    "quality": "1"
                },
                "sections": ["AG1"],
            }]);

            const res = await request(server).get("/weather");

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toEqual(true);
            expect(res.body.error).not.toBeDefined();
        });
        // empty array if call letter is not valid
        it("should return an error message on error", async () => {
            weatherData.getAll.mockResolvedValue(null);

            const res = await request(server).get("/weather");

            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toBeDefined();
        });
    });

    describe("TEST GET WEATHER BY CALL LETTERS GET /callLetters/:callLetters", () => {
        it("should return an array of weather on success", async () => {

            weatherData.getByCallLetters.mockResolvedValue([{
                "_id": "5553a998e4b02cf715119a97",
                "st": "x+48300-044400",
                "ts": "1984-03-05T21:00:00.000Z",
                "position": {
                    "type": "Point",
                    "coordinates": [-44.4, 48.3] 
                },
                "elevation": 9999,
                "callLetters": "VCSZ",
                "qualityControlProcess": "V020",
                "dataSource": "4",
                "type": "FM-13",
                "airTemperature": {
                    "value": -4.7,
                    "quality": "1"
                },
                "sections": ["AG1"],
            }]);
            const res = await request(server).get("/weather/callLetters/PLAT");

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toEqual(true);
            expect(res.body.error).not.toBeDefined();
        });
        it("should return an empty array if no weather matches call letters", async () => {
            weatherData.getByCallLetters.mockResolvedValue([]);

            const res = await request(server).get("/weather/callLetters/PLAT");

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
            expect(res.body.error).not.toBeDefined();
        });
        it("should return an error message on error", async () => {
            weatherData.getByCallLetters.mockResolvedValue(null);
            const res = await request(server).get("/weather/callLetter/PLAT");

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).not.toBeDefined();
        });

    });

    describe("test create a new weather object POST /weather", () => {
        it("should confirm that a new weather object was created", async () => {
          weatherData.create.mockResolvedValue([{
                "st": "x+48300-044400",
                "ts": "1984-03-05T21:00:00.000Z",
                "position": {
                    "type": "Point",
                    "coordinates": [-44.4, 48.3] 
                },
                "elevation": 9999,
                "callLetters": "VCSZ",
                "qualityControlProcess": "V020",
                "dataSource": "4",
                "type": "FM-13",
                "airTemperature": {
                    "value": -4.7,
                    "quality": "1"
                },
                "sections": ["AG1"],
        }]);
    
          const res = await request(server).post("/weather");
    
          expect(res.statusCode).toEqual(200);
          expect(Array.isArray(res.body)).toEqual(true);
          expect(res.body.error).not.toBeDefined();
    
        });
        it("should return an error message if a weather object is not created", async () => {
          weatherData.create.mockResolvedValue({ "error": "The weather id provided is not a valid movie id. " });
    
          const res = await request(server).post("/weather");
          expect(res.statusCode).toEqual(400);
          expect(res.body.error).toBeDefined();
        });
      });
})