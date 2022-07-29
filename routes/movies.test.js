const request = require("supertest");
const server = require("../server");

// the mock data should be define before the test
jest.mock("../dataInterface/movies")
const movieData = require("../dataInterface/movies")

describe("/movies routes", () => {

  beforeEach(() => {

  });

  describe("GET /", () =>{
    it("should return an array on success", async () => {
      movieData.getAll.mockResolvedValue([{title: 'one'}])
      
      const res = await request(server).get("/movies");
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true)
      expect(res.body.error).not.toBeDefined()
    });
    it("should return an error message on error", async ()=>{
      movieData.getAll.mockResolvedValue(null)
      const res = await request(server).get("/movies")
      expect(res.status).toEqual(500)
      expect(res.body.error).toBeDefined()
    })
  });

  describe("GET /:id", () =>{
    it("should return a single with ID", async () => {
      movieData.getByIdOrTitle.mockResolvedValue({title: 'one', _id: '7'})
      const res = await request(server).get("/movies/7")
      expect(res.body.error).not.toBeDefined()
      expect(res.status).toEqual(200)
    });
    it("should return a single with title", async () => {
      movieData.getByIdOrTitle.mockResolvedValue({title: 'one two', _id: '7'})
      const res = await request(server).get("/movies/one%20two")
      expect(res.body.error).not.toBeDefined()
      expect(res.status).toEqual(200)
    });
    it("should return an error message if no movies exist", async ()=>{
      movieData.getByIdOrTitle.mockResolvedValue({error: "Something went wrong. Please try again."})
      const res = await request(server).get("/movies/8")
      expect(res.body.error).toBeDefined()
      expect(res.status).toEqual(404)
    })
  });

  describe("POST /", () =>{
    it("should return the new movie on success", async () => {
      movieData.create.mockResolvedValue({ newObjectId: 'adskas2232323aasds', message: `Item created! ID: adskas2232323aasds ` })
      const res = await request(server).post("/movies")
      expect(res.body.error).not.toBeDefined()
      expect(res.status).toEqual(200)
    });
    it("should return error if it fails to create a movies", async ()=>{
      movieData.create.mockResolvedValue({error: "Something went wrong. Please try again."})
      res = await request(server).post("/movies")
      expect(res.body.error).toBeDefined()
      expect(res.status).toEqual(400)
    })
  });

  describe("PUT /:id", () =>{
    it("should return the updated movie on success", async () => {
      movieData.updateById.mockResolvedValue({title: 'updated Title', id: '7'})
      res = await request(server).put("/movies/7")
      expect(res.body.error).not.toBeDefined()
      expect(res.status).toEqual(200)
    });
    it("should return an errrorr if it did not update the movie", async () =>{
      movieData.updateById.mockResolvedValue({error: 'Something went wrong. "${result.modifiedCount}" movies were not updated. Please try again.'})
      res = await request(server).put("/movies/7")
      expect(res.body.error).toBeDefined()
      expect(res.status).toEqual(400)
    })
  });

  describe("DELETE /:id", () =>{
    it("should return a message on success of deletion", async () => {
      movieData.deleteById.mockResolvedValue({message: `Deleted ... movie.`});
      res = await request(server).del("/movies/7")
      expect(res.body.error).not.toBeDefined()
      expect(res.status).toEqual(200)

    });
    it("should return a error on failed deletion", async () => {
      movieData.deleteById.mockResolvedValue({error: `Something went wrong....`});
      res = await request(server).del("/movies/7")
      expect(res.body.error).toBeDefined()
      expect(res.status).toEqual(400)
    });
  });

  describe("GET /:id/comments", ()=>{
    it("should return all comments on a single movie", async () => {
      movieData.getAllComments.mockResolvedValue([{_id:"5a9427648b0beebeb695f92d",name:"Anthony Cline",email:"anthony_cline@fakegmail.com",movie_id:"573a1399f29313caabcedc5d",text:"Consequatur eveniet quidem id error iure non. Odit id quia ad recusandae architecto cum doloribus. Totam officiis placeat cumque perferendis.", date:"1992-11-14T09:45:38.000Z"}])
      let param = "573a1399f29313caabcedc5d"
      res = await request(server).get(`/movies/${param}/comments`)
      expect(res.body[0].movie_id).toEqual(param)
      expect(res.status).toEqual(200)
      expect(res.body.error).not.toBeDefined()
    })
    it("should return an error if theres no comments ", async () =>{
      movieData.getAllComments.mockResolvedValue({error: "Comments cannot be found"})
      let param = "573a1399f29313caabcedc5d"
      res = await request(server).get(`/movies/${param}/comments`)
      expect(res.status).toEqual(404)
      expect(res.body.error).toBeDefined()
    })
  })

  describe("POST /:id/comments", ()=>{
    it("should return a success if comment was created", async ()=>{
      movieData.createComment.mockResolvedValue({ newObjectId: 'result.insertedId', message: 'Comment created! ID: {result.insertedId}' })
      let param = "573a1399f29313caabcedc5d"
      res = await request(server).post(`/movies/${param}/comments`)
      expect(res.status).toEqual(200)
      expect(res.body.error).not.toBeDefined()
    });
    it("should return an error if it could not create a comment", async () => {
      movieData.createComment.mockResolvedValue({error: "Something went wrong. Please try again."})
      let param = "573a1399f29313caabcedc5d"
      res = await request(server).post(`/movies/${param}/comments`)
      expect(res.status).toEqual(400)
      expect(res.body.error).toBeDefined()
    })
  })

  
});