const { Router } = require('express');
const router = Router();
const movieData = require('../dataInterface/movies');

// Route to retrieve (GET) all movies from database
// curl http://localhost:5000/movies
router.get('/', async (req, res) => {
  let resultStatus;
  const result = await movieData.getAllMovies();

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Route to retrieve (GET) all comments for all movies
// curl http://localhost:5000/movies/comments
router.get('/genres/:genreName', async (req, res) => {
  let resultStatus;
  const result = await movieData.getMoviesByGenre(req.params.genreName);

  if (result === null) {
    resultStatus = 500;
  } else if (result.length === 0) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Route to retrieve (GET) a single movie
// curl http://localhost:5000/movies/573a13f6f29313caabde538a/
router.get('/:id', async (req, res) => {
  let resultStatus;
  const result = await movieData.getMovieById(req.params.id);

  !result.error ? (resultStatus = 200) : (resultStatus = 404);
  res.status(resultStatus).send(result);
});

// Route to retrieve (GET) all comments for a single movie
// curl http://localhost:5000/movies/573a1390f29313caabcd4323/comments
router.get('/:movieId/comments', async (req, res) => {
  let resultStatus;
  const result = await movieData.getMovieComments(req.params.movieId);

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }
  res.status(resultStatus).send(result);
});

// Route to create (POST) a single movie
// curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/movies
router.post('/', async (req, res) => {
  let statusCode;
  let result = await movieData.createMovie(req.body);

  if (result === null) {
    statusCode = 500;
  } else if (result.error) {
    statusCode = 400;
  } else {
    statusCode = 200;
  }

  res.status(statusCode).send(result);
});

// Route to insert (POST) a new comment for a specific movie
// curl -X POST -H "Content-Type: application/json" -d '{"name": "Max Power", "email": "max@power.co", "text": "Love this post! Amazing! Lorem ipsum yabba dabba do."}' http://localhost:5000/movies/573a1397f29313caabce69db/comments
router.post('/:movieId/comments', async (req, res) => {
  let resultStatus;
  let result = await movieData.createComment(req.params.movieId, req.body);

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Route to update (PUT) a single movie
// curl -X PUT -H "Content-Type: application/json" -d '{"plot": "Sharks..."}' http://localhost:5000/movies/573a13a3f29313caabd0e77b
router.put('/:id', async (req, res) => {
  let resultStatus;
  const result = await movieData.updateMovieById(req.params.id, req.body);

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Route to remove (DELETE) a single movie
// curl -X DELETE http://localhost:5000/movies/573a1397f29313caabce69db
router.delete('/:movieId', async (req, res) => {
  const result = await movieData.deleteMovieById(req.params.movieId);

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

module.exports = router;
