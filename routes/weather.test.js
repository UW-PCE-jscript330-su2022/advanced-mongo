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

    // describe("GET /:id", () =>{
    //     it("should return a single weather on success", async () => {
    //         weatherData.getByIdOrTitle.mockResolvedValue([{_id:"573a1397f29313caabce8896", title: "One Day"}])
    //         const res = await request(server).get("/weathers/573a1397f29313caabce8896")
    //         expect(res.statusCode).toEqual(200)
    //     });
    //
    //     it("should return a 404 if an error is found", async () => {
    //         weatherData.getByIdOrTitle.mockResolvedValue(null)
    //         const res = await request(server).get("/weathers/573a1397f29313caabce69db")
    //         expect(res.statusCode).toEqual(404)
    //
    //     });
    // });
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
    // describe("PUT /:id", () =>{
    //     it("should return the updated weather on success", async () => {
    //         weatherData.updateById.mockResolvedValue({"_id": "62df8cfe33d248a8ed01b9dc", "title": "Trip to the Moon IVi", "plot": null})
    //         const res = await request(server).put("/weathers/62df8cfe33d248a8ed01b9dc")
    //         expect(res.statusCode).toEqual(200);
    //         // check status code 200
    //     });
    //     it("should return an error if weather fails to be updated", async () => {
    //         weatherData.updateById.mockResolvedValue({error: `Something went wrong. 0 weathers were updated. Please try again.`})
    //         const res = await request(server).put("/weathers/62df8cfe33d248a8ed01b9dc")
    //         expect(res.statusCode).toEqual(400);
    //     });
    // });
    //
    // describe("DELETE /:id", () =>{
    //     it("should return a message on success", async () => {
    //         weatherData.deleteById.mockResolvedValue({message: `Deleted 1 weather.`})
    //         const res = await request(server).delete("/weathers/573a1397f29313caabce8896")
    //         expect(res.statusCode).toEqual(200);
    //         // check status code 200
    //     });
    //     it("should return an error message if weather fails to be deleted", async () => {
    //         weatherData.deleteById.mockResolvedValue({error: `Something went wrong. 0 weathers were deleted. Please try again.`})
    //         const res = await request(server).delete("/weathers/573a1397f29313caabce8896")
    //         expect(res.statusCode).toEqual(400);
    //     });
    // });
    //
    // describe("GET /:id/comments", () =>{
    //     it("should return an array on success", async () => {
    //         weatherData.getAllComments.mockResolvedValue([
    //             {"_id": "5a9427648b0beebeb695de8c",
    //                 "name": "Thomas Green",
    //                 "email": "thomas_green@fakegmail.com",
    //                 "weather_id": "573a1398f29313caabcebc0b",
    //             }])
    //
    //         const res = await request(server).get("/weathers/573a1398f29313caabcebc0b/comments")
    //         expect(res.statusCode).toEqual(200)
    //         expect(Array.isArray(res.body)).toEqual(true)
    //         expect(res.body).toBeInstanceOf(Array)
    //         expect(res.body.error).not.toBeDefined()
    //
    //     });
    //     it("should return an error message on error", async () => {
    //         // make a request
    //         // parse the response
    //         // expectations about the response
    //
    //         weatherData.getAllComments.mockResolvedValue(null)
    //         const res = await request(server).get("/weathers/573a1398f29313caabcebc0b/comments")
    //         expect(res.statusCode).toEqual(500)
    //         expect(res.body.error).toBeDefined()
    //
    //     });
    // });
    //
    // describe("GET /:id/comments/:commentId", () =>{
    //     it("should return a single comment on success", async () => {
    //         weatherData.getAComment.mockResolvedValue([{
    //             "_id": "62df745922ea6d641e865785",
    //             "post": "Trip to the Moon Forever Sucks third Comment",
    //             "weather_id": "573a1397f29313caabce8896",
    //             "date": "2022-07-26T04:58:01.072Z"
    //         }])
    //         const res = await request(server).get("/weathers/573a1397f29313caabce8896/comments/000")
    //         expect(res.statusCode).toEqual(200)
    //     });
    //
    //     it("should return a 404 if an error is found", async () => {
    //         weatherData.getAComment.mockResolvedValue({error: `No comment found with identifier 0.`})
    //         const res = await request(server).get("/weathers/573a1397f29313caabce69db/comments/000")
    //         expect(res.statusCode).toEqual(404)
    //
    //     });
    // });
    //
    // describe("POST /:id/comments", () =>{
    //     it("should return the new comment on success", async () => {
    //
    //         weatherData.createComment.mockResolvedValue({
    //             "newObjectId": "62df93c1f497479798d1af37",
    //             "message": "Comment created! ID: 62df93c1f497479798d1af37"
    //         })
    //         const res = await request(server).post("/weathers/573a1397f29313caabce8896/comments")
    //         expect(res.statusCode).toEqual(200);
    //
    //     });
    //
    //     it("should return an error message if a comment fails to be created", async () => {
    //         weatherData.createComment.mockResolvedValue({error: "Something went wrong. Please try again."})
    //         const res = await request(server).post("/weathers/573a1397f29313caabce8896/comments")
    //         expect(res.body.error).toBeDefined()
    //
    //     });
    //
    // });
    //
    // describe("DELETE /:id/comments/:commentId", () =>{
    //     it("should return a message on success", async () => {
    //         weatherData.deleteCommentById.mockResolvedValue({message: `Deleted 1 comment.`})
    //         const res = await request(server).delete("/weathers/573a1397f29313caabce8896/comments/000")
    //         expect(res.statusCode).toEqual(200);
    //         // check status code 200
    //     });
    //     it("should return an error message if comments fails to be deleted", async () => {
    //         weatherData.deleteCommentById.mockResolvedValue({error: `Something went wrong. 0 comments were deleted. Please try again.`})
    //         const res = await request(server).delete("/weathers/573a1397f29313caabce8896/comments/000")
    //         expect(res.statusCode).toEqual(400);
    //     });
    // });
    //
    // describe("PUT /:id/comments/:commentId", () =>{
    //     it("should return the updated comment on success", async () => {
    //         weatherData.updateCommentById.mockResolvedValue({
    //             "_id": "62df8cfe33d248a8ed01b9dc",
    //             "post": "Trip to the Moon Forever Sucks extra extra extra Comment",
    //             "weather_id": "573a1397f29313caabce8896",
    //             "date": "2022-07-26T05:22:23.673Z"
    //         })
    //         const res = await request(server).put("/weathers/62df8cfe33d248a8ed01b9dc/comments/000")
    //         expect(res.statusCode).toEqual(200);
    //         // check status code 200
    //     });
    //     it("should return an error if weather fails to be updated", async () => {
    //         weatherData.updateCommentById.mockResolvedValue({
    //             error: `Something went wrong. 0 comments were updated. Please try again.`})
    //         const res = await request(server).put("/weathers/62df8cfe33d248a8ed01b9dc/comments/000")
    //         expect(res.statusCode).toEqual(400);
    //     });
    // });

});
