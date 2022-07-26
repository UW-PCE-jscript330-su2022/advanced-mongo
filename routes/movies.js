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
    const result = await movieData.getByIdOrTitle(req.params.id);

    console.log(result);

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

  res.status(resultStatus).send(result);
});

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

/* --- HOMEWORK #3 Items
*/

// Get all comments from a specific movie
// Pattern: http://localhost:5000/movies/:movieId/comments
// using for testing: 
//      id: 573a13b7f29313caabd49ace, James Cameron's Avatar
router.get("/:movieId/comments", async(req, res) => {
    const result = await movieData.getAllComments(req.params.movieId);
    
    if(result.length > 0) {
        resultStatus = 200;
    } else {
        resultStatus = 404;
    }

    res.status(resultStatus).send(result);
  })
  

// Get a single comment
// Pattern: http://localhost:5000/movies/:movieId/:commentId
// using for testing, ids from Avatar example
//      id: 5a9427658b0beebeb6974473
//      id: 5a9427658b0beebeb697446f
//      id: 5a9427658b0beebeb697446b
router.get("/:movieId/comments/:commentId", async(req, res) => {
    const result = await movieData.getMovieCommentById(req.params.movieId, req.params.commentId);
    
    if(result.length > 0) {
        resultStatus = 200;
    } else {
        resultStatus = 404;
    }

    res.status(resultStatus).send(result);
})

// Create a comment for a given movie
// Pattern: http://localhost:5000/movies/:movieId/comments
// curl -X POST -H "Content-Type: application/json" -d '{"name":"Cinephile Cyprus", "text":"Wow!"}' http://localhost:5000/movies/000/comments
router.post("/:id/comments", async(req, res) => {
    const result = await movieData.createComment(req.params.id, req.body);
  
    if (result.length > 0) {
        resultStatus = 200;
    } else {
        resultStatus = 404;
    }
    res.status(resultStatus).send(result);
})


// Update a given comment
// Pattern: http://localhost:5000/movies/:movieId/comments/:commentId
// curl -X PUT -H "Content-Type: application/json" -d '{"name":"Bobby Longshanks", "text": "More like a depressed potato."}' http://localhost:5000/movies/573a13b7f29313caabd49ace
router.put("/:movieId/comments/:commentId", async(req, res) => {
    const result = await movieData.updateCommentById(req.params.commentId);
    res.status(200).send(result);
})

// Delete a given comment
// Pattern: http://localhost:5000/movies/:movieId/comments/:commentId
// 
// curl -X DELETE http://localhost:5000/movies/:movieId/comments/:commentId
router.delete("/:movieId/comments/:commentId", async(req, res)=>{
    const result = await movieData.deleteCommentById(req.params.commentId);
    res.status(200).send(result);
})

module.exports = router;
