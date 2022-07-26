const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');

// curl http://localhost:5000/movies
router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll()

  if(movieList){
    res.status(200).send(movieList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// This route handles either id or title as an identifier.
// curl http://localhost:5000/movies/573a1390f29313caabcd4135
// curl http://localhost:5000/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)
  // if(result.error){
  //   resultStatus = 404;
  // } else {
  //   resultStatus = 200;
  // }
  // res.status(resultStatus).send(result);
  if(result){
    resultStatus = 200;
  } else {
    resultStatus = 404;
  }
  res.status(resultStatus).send(result);


});

// Get all comments for a movie

router.get("/:id/comments", async(req, res) =>{
  console.log("GET comments for a movie: ", req.params.id)
  const result = await movieData.getAllComments(req.params.id)

  if(result){
    res.status(200).send(result)
  } else {
    // If comments is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }

})

// Get a single comment

router.get("/:id/comments/:commentId", async (req, res, next) => {
  const result = await movieData.getAComment(req.params.commentId)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// Create a comments for a movie

router.post("/:id/comments", async(req, res) =>{
  console.log("CREATE a comment for a movie: ", req.params.id)
  const result = await movieData.createComment(req.params.id, req.body)
  res.status(200).send(result)
})

// curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/movies
router.post("/", async (req, res, next) => {
  let resultStatus;
  let result = await movieData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks..."}' http://localhost:5000/movies/573a13a3f29313caabd0e77b
router.put("/:id", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateById(req.params.id, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  // if(result){
  //   resultStatus = 200;
  // } else {
  //   resultStatus = 404;
  // }

  res.status(resultStatus).send(result);
});

// update a comment

router.put("/:id/comments/:commentId", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateCommentById(req.params.commentId, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// delete a comment for a movie

router.delete("/:movieId/comments/:commentId", async(req, res) =>{
  console.log("Delete a comment for a movie: ", req.params.commentId)
  const result = await movieData.deleteCommentById(req.params.commentId)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);


})

// curl -X DELETE http://localhost:5000/movies/573a1390f29313caabcd4135
router.delete("/:id", async (req, res, next) => {
  const result = await movieData.deleteById(req.params.id);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

module.exports = router;
