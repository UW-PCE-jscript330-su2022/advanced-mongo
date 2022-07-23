const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');

// GET ALL MOVIES
// curl -sS http://localhost:5001/movies
router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll()

  if(movieList){
    res.status(200).send(movieList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});


// GET MOVIES BY TITLE OR ID
// This route handles either id or title as an identifier.
// curl -sS http://localhost:5001/movies/573a1390f29313caabcd4135
// curl -sS http://localhost:5001/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

//GET ALL COMMENTS FOR A MOVIE
// curl -sS http://localhost:5001/movies/573a1393f29313caabcdbe7c/comments
router.get("/:id/comments", async(req, res) => {
  const result = await movieData.getAllComments(req.params.id)
  res.status(200).send(result);
  
})


// CREATE A NEW MOVIE
// curl -sS -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5001/movies
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

//CREATE A NEW COMMENT
// curl -sS -X POST -H "Content-Type: application/json" -d '{"name":"Cinephile Cyprus", "text":"Wow!"}' http://localhost:5001/movies/000/comments
router.post("/:id/comments", async(req, res) => {
  // const result = await movieData.createComment(req.params.id, req.body)
  // res.status(200).send(result);
  console.log("Create a new comment for a movie", (req.params.id))
  res.status(200).send("ok :)");
})


// UPDATE A MOVIE PLOT
// curl -sS -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks..."}' http://localhost:5001/movies/62db489c4d8c10f61cf878e0
router.put("/:id", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateById(req.params.id, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});


// DELETE A MOVIE
// curl -sS -X DELETE http://localhost:5001/movies/62db489c4d8c10f61cf878e0
router.delete("/:id", async (req, res, next) => {
  const result = await movieData.deleteById(req.params.id);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// DELETE A MOVIE COMMENT
// curl -sS -X DELETE http://localhost:5001/movies/000/comments/000
router.delete("/:movieId/comments/:commentId", async(req, res)=>{
  // const result = await movieData.deleteCommentById(req.params.commentId)
  // res.status(200).send(result);
  console.log("Delete a comment for a movie", (req.params.commentId))
  res.status(200).send("ok :)");
})

module.exports = router;