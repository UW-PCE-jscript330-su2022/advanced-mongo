const { Router } = require("express");
const router = Router();

const commentData = require('../dataInterface/comments');

// curl http://localhost:5000/movies/:id/comments
// GET ALL COMMENTS FOR A MOVIE
router.get("/:movie_id/comments", async (req, res, next) => {
  let commentList = await commentData.getAllComments(req.params.id)

  if(commentList){
    res.status(200).send(commentList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// This route handles comment id as an identifier.
// curl http://localhost:5000/movies/573a1390f29313caabcd4135
router.get("/comments/:id", async (req, res, next) => {
  const result = await movieData.getCommentByCommentIdOrMovieId(req.params.id)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});


// curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/movies
router.post("/", async (req, res, next) => {
  let resultStatus;
  let result = await commentData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// CREATE A NEW COMMENT FOR A MOVIE
router.post("/:id/comments", async(req, res) => {
  const result = await commentData.createComment(req.params.id, req.body)
  res.status(200).send(result);
})

// curl -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks..."}' http://localhost:5000/movies/573a13a3f29313caabd0e77b
router.put("/:id/comments", async (req, res, next) => {
  let resultStatus;
  const result = await commentData.updateById(req.params.id, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X DELETE http://localhost:5000/movies/573a1390f29313caabcd4135
// DELETE A COMMENT
router.delete("/:movieId/comments/:commentId", async(req, res)=>{
  const result = await commentData.deleteCommentById(req.params.commentId)
  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
})

module.exports = router;