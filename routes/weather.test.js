const request = require("supertest");
const server = require("../server");

jest.mock("../dataInterface/weather");
const weatherData = require("../dataInterface/weather")

describe("/weather routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {

      weatherData.getAllWeatherReport.mockResolvedValue([{
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
        "dewPoint": {
            "value": 999.9,
            "quality": "9"
        },
        "pressure": {
            "value": 1017.1,
            "quality": "1"
        },
        "wind": {
            "direction": {
                "angle": 999,
                "quality": "9"
            },
            "type": "9",
            "speed": {
                "rate": 999.9,
                "quality": "9"
            }
        },
        "visibility": {
            "distance": {
                "value": 999999,
                "quality": "9"
            },
            "variability": {
                "value": "N",
                "quality": "9"
            }
        },
        "skyCondition": {
            "ceilingHeight": {
                "value": 99999,
                "quality": "9",
                "determination": "9"
            },
            "cavok": "N"
        },
        "sections": ["AG1"],
        "precipitationEstimatedObservation": {
            "discrepancy": "2",
            "estimatedWaterDepth": 0
        }
    }]);
      const res = await request(server).get("/weather");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined();

    });
    it("should return an error message on error", async () => {
      weatherData.getAllWeatherReport.mockResolvedValue(null);
      const res = await request(server).get("/weather");
      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

});

describe("POST /", () =>{
    it("should return the new weather object on success", async () => {
      weatherData.create.mockResolvedValue([{
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
        "dewPoint": {
            "value": 999.9,
            "quality": "9"
        },
        "pressure": {
            "value": 1017.1,
            "quality": "1"
        },
        "wind": {
            "direction": {
                "angle": 999,
                "quality": "9"
            },
            "type": "9",
            "speed": {
                "rate": 999.9,
                "quality": "9"
            }
        },
        "visibility": {
            "distance": {
                "value": 999999,
                "quality": "9"
            },
            "variability": {
                "value": "N",
                "quality": "9"
            }
        },
        "skyCondition": {
            "ceilingHeight": {
                "value": 99999,
                "quality": "9",
                "determination": "9"
            },
            "cavok": "N"
        },
        "sections": ["AG1"],
        "precipitationEstimatedObservation": {
            "discrepancy": "2",
            "estimatedWaterDepth": 0
        }
    }]);
      const res = await request(server).post("/weather");
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeDefined();
    });

    it("should return an error message if weather object fails to be created", async () => {
        weatherData.create.mockResolvedValue({ "error": "The weather object not found " });
      const res = await request(server).post("/weather");
      expect(res.statusCode).toEqual(400);
     
    });
  });

  describe("GET /callLetters/:callLetter", () =>{
    it("should return a result on success", async () => {
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
            "dewPoint": {
                "value": 999.9,
                "quality": "9"
            },
            "pressure": {
                "value": 1017.1,
                "quality": "1"
            },
            "wind": {
                "direction": {
                    "angle": 999,
                    "quality": "9"
                },
                "type": "9",
                "speed": {
                    "rate": 999.9,
                    "quality": "9"
                }
            },
            "visibility": {
                "distance": {
                    "value": 999999,
                    "quality": "9"
                },
                "variability": {
                    "value": "N",
                    "quality": "9"
                }
            },
            "skyCondition": {
                "ceilingHeight": {
                    "value": 99999,
                    "quality": "9",
                    "determination": "9"
                },
                "cavok": "N"
            },
            "sections": ["AG1"],
            "precipitationEstimatedObservation": {
                "discrepancy": "2",
                "estimatedWaterDepth": 0
            }
        }]);

      const res = await request(server).get("/weather/callLetters/VCSZ");
      expect(res.statusCode).toEqual(200);
     expect(res.body.error).not.toBeDefined();

    });

    it("should return an empty array if not found", async () => {
        
     weatherData.getByCallLetters.mockResolvedValue(null);
     const res = await request(server).get("/weather/callLetters/VCSZ566");
     expect(res.statusCode).toEqual(404);
      expect(res.body.error).not.toBeDefined();
    });
  });
