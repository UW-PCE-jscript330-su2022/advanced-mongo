const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');
// const commentData = require('../dataInterface/comments');

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




//GET ALL COMMENTS FOR A MOVIE
// curl -sS http://localhost:5001/movies/573a1393f29313caabcdbe7c/comments
// curl -sS http://localhost:5001/movies/573a1390f29313caabcd446f/comments

router.get("/:id/comments", async(req, res) => {
  const result = await movieData.getAllComments(req.params.id)
  if (result) {
    res.status(200).send(result);
  } else {
    resultStatus = 404;
  }
  
})

// GET MOVIES BY TITLE OR ID
// This route handles either id or title as an identifier.
// curl -sS http://localhost:5001/movies/573a1390f29313caabcd4135
// curl -sS http://localhost:5001/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)
console.log(result);
  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});


// FIND A SINGLE COMMENT FOR A MOVIE
// curl -sS http://localhost:5001/movies/573a1390f29313caabcd4323/comments/5a9427648b0beebeb69579e7

router.get("/:movieId/comments/:commentId", async (req, res, next) => {
  const result = await movieData.getOneComment(req.params.commentId)
  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// CREATE A NEW MOVIE
// curl -sS -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5001/movies
// new id: 62df1af940ac945c80be005e
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
// curl -sS -X POST -H "Content-Type: application/json" -d '{"name":"Cinephile Cyprus", "text":"Wow!"}' http://localhost:5001/movies/573a1390f29313caabcd446f/comments
// created 62dc5a9181fc490e55e22f45; 62dc741fcd7ef831caf9aa98
router.post("/:id/comments", async(req, res) => {
  const result = await movieData.createComment(req.params.id, req.body)
  if(result){
    res.status(200).send(result);
  } else {
    resultStatus = 400;
  }
  
  
})



// UPDATE A MOVIE PLOT
// curl -sS -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks..."}' http://localhost:5001/movies/62df1af940ac945c80be005e
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

// UPDATE A COMMENT TEXT
// curl -sS http://localhost:5001/movies/573a1390f29313caabcd446f/comments
// curl -sS -X PUT -H "Content-Type: application/json" -d '{"text":"My favorite movie!"}' http://localhost:5001/movies/573a1390f29313caabcd446f/comments/62dc5a9181fc490e55e22f45
router.put("/:movieId/comments/:commentId", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateCommentById(req.params.commentId, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// DELETE A MOVIE
// curl -sS -X DELETE http://localhost:5001/movies/62df1af940ac945c80be005e
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
// curl -sS http://localhost:5001/movies/573a1390f29313caabcd446f/comments
// curl -sS -X DELETE http://localhost:5001/movies/573a1390f29313caabcd446f/comments/62dc5a9181fc490e55e22f45
router.delete("/:movieId/comments/:commentId", async(req, res)=>{
  const result = await movieData.deleteCommentById(req.params.commentId)
  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

})

// GET MOVIES BY GENRE
// curl -sS http://localhost:5001/movies/genres/Short
router.get("/genres/:genreName", async (req, res, next) => {
  const result = await movieData.getMoviesByGenre(req.params.genreName);

  if (result) {
    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      res.status(404).send({error: `No movie found for ${req.params.genreName} genre`});
    }
  } else {
    res.status(500).send({error:"Something went wrong. Please try again."})
  }
});

module.exports = router;
