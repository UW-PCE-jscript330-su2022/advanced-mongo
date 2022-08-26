const request = require("supertest");
const server = require("../server");

// the mock data should be define before the test
jest.mock("../dataInterface/weather")
const weatherData = require("../dataInterface/weather")

describe("/movies routes", () => {

  // beforeEach(() => {

  // });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      // ensure the function being call exist in the data interface file --- there's no pseudo functions
      weatherData.getQuery.mockResolvedValue([{weather: 'Warm'}, {weather: 'Warmer'}])
      const res = await request(server).get("/weather/");
      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true)
    });
    it("should return a 400 for null response body", async () =>{
      weatherData.getQuery.mockResolvedValue(null);
      const res = await request(server).get("/weather/")
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({"ERROR": "Failed to fetch data", "STATUS": 400})
    })
    it("should return a 400 for undifined response body", async () =>{
      weatherData.getQuery.mockResolvedValue(undefined);
      const res = await request(server).get("/weather/")
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({"ERROR": "Failed to fetch data", "STATUS": 400})
    })
    it("should return a 400 for [] response body", async () =>{
      weatherData.getQuery.mockResolvedValue([]);
      const res = await request(server).get("/weather/")
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({"ERROR": "Failed to fetch data", "STATUS": 400})
    })
  });

  describe("GET /:callLetters", ()=>{
    it("should return an array of records matching the CallLetters", async () =>{
      weatherData.getByLetters.mockResolvedValue([{weather: "warm"}])    
      const res = await request(server).get("/weather/VC81")
      expect(res.status).toEqual(200)
      expect(Array.isArray(res.body)).toEqual(true)
    });
    it("should return an array with a messege if the url is wrong", async () =>{
      weatherData.getByLetters.mockResolvedValue([{weather: "warm"}])    
      const res = await request(server).get("/weather/callLetters=VC81")
      expect(res.status).toEqual(200)
      expect(Array.isArray(res.body)).toEqual(true)
    });
    it("should return a 400 for null response body", async () =>{
      weatherData.getByLetters.mockResolvedValue(null);
      const res = await request(server).get("/weather/VC81")
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({"ERROR": "Failed to fetch data", "STATUS": 400})
    })
    it("should return a 400 for undifined response body", async () =>{
      weatherData.getByLetters.mockResolvedValue(undefined);
      const res = await request(server).get("/weather/VC81")
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({"ERROR": "Failed to fetch data", "STATUS": 400})
    })
    it("should return a 400 for [] response body", async () =>{
      weatherData.getByLetters.mockResolvedValue([]);
      const res = await request(server).get("/weather/VC81")
      expect(res.status).toEqual(400)
      expect(res.body).toEqual({"ERROR": "Failed to fetch data", "STATUS": 400})
    })
  });

  describe("POST /", ()=>{
    it("should create a new weather record", async () =>{
      weatherData.create.mockResolvedValue({ newObjectId: "f46a46as6f4s4f69", message: "Item created! ID: f46a46as6f4s4f69"})
      const res = await request(server).post('/weather/')
      expect(res.status).toEqual(200)
      expect(typeof res.body === 'object').toEqual(true)
    })
    it("it should send a 400 if it fails to create a new record", async () =>{
      weatherData.create.mockResolvedValue({Error: "Failed to Create"});
      const res = await request(server).post('/weather/')
      expect(res.status).toEqual(400)
      expect(typeof res.body === 'object').toEqual(true)
    })
  });

})