const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');

// --------------------- //
// --- movies routes --- //
// --------------------- //

// curl http://localhost:5000/movies
router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll()

  if (movieList) {
    res.status(200).send(movieList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({ error: "Something went wrong. Please try again." })
  }
});

// curl http://localhost:5000/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)

  if (result.error) {
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

  if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});


// curl -X PUT -H "Content-Type: application/json" -d '{"plot":"zombies..."}' http://localhost:5000/movies/573a1390f29313caabcd4eaf
router.put("/:id", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateById(req.params.id, req.body)

  if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X DELETE http://localhost:5000/movies/573a1390f29313caabcd4135
router.delete("/:id", async (req, res, next) => {
  const result = await movieData.deleteById(req.params.id);

  if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// ----------------------- //
// --- comments routes --- //
// ----------------------- //

// curl http://localhost:5000/movies/573a1390f29313caabcd4eaf/comments
router.get("/:id/comments", async (req, res) => {
  const result = await movieData.getAllComments(req.params.id)
  if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }
  res.status(resultStatus).send(result)
});

// curl http://localhost:5000/movies/573a1391f29313caabcd8543/comments/5a9427648b0beebeb6957ba7/text
router.get("/:movieId/comments/:commentId", async (req, res) => {
  const result = await movieData.getOneComment(req.params.id)
  if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }
  res.status(resultStatus).send(result)
});

// curl -X POST -H "Content-Type: application/json" -d '{"name":"Cinephile Cyprus", "text":"Wow!"}' http://localhost:5000/movies/573a1390f29313caabcd4eaf/comments
router.post("/:id/comments", async(req, res) => {
  const result = await movieData.createComment(req.params.id, req.body)
  res.status(200).send(result);
})

// curl -X PUT -H "Content-Type: application/json" -d '{"name":"zombies...", "text": "butts"}' http://localhost:5000/movies/573a1391f29313caabcd7c9e/comments
router.put("/:id/comments", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateCommentById(req.params.id, req.body)

  if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

module.exports = router;
