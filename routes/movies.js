const { Router } = require('express');
const router = Router();

const movieData = require('../dataInterface/movies');

const statusCodes = require('../etc/statusCodes');

// Route to retrieve (GET) all movies from database
// curl http://localhost:5000/movies
router.get('/', async (req, res, next) => {
  let resultStatus;
  let results = await movieData.getAllMovies();

  if (results === null) {
    resultStatus = 500;
  } else if (results.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(results);
});

// Route to retrieve (GET) all comments for all movies
// curl http://localhost:5000/movies/comments
router.get('/comments', async (req, res, next) => {
  let resultStatus;
  const result = await movieData.getAllComments();

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
router.get('/:id', async (req, res, next) => {
  let resultStatus;
  const results = await movieData.getMovieById(req.params.id);

  !results.error ? (resultStatus = 200) : (resultStatus = 404);
  res.status(resultStatus).send(results);
});

// Route to retrieve (GET) a single comment for a specified movie
// curl http://localhost:5000/movies/573a1390f29313caabcd4323/comments/5a9427648b0beebeb69579e7/
router.get('/:id/comments/:commentId', async (req, res, next) => {
  let resultStatus;
  const result = await movieData.getCommentById(
    req.params.id,
    req.params.commentId
  );

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(result.status).send(result.results);
});

// Route to retrieve (GET) all comments for a single movie
// curl http://localhost:5000/movies/573a1390f29313caabcd4323/comments
router.get('/:id/comments', async (req, res, next) => {
  let resultStatus;
  const result = await movieData.getMovieComments(req.params.id);

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
router.post('/', async (req, res, next) => {
  let statusCode;
  let results = await movieData.createMovie(req.body);

  if (results === null) {
    statusCode = 500;
  } else if (results.error) {
    statusCode = 400;
  } else {
    statusCode = 200;
  }

  res.status(statusCode).send(results);
});

// Route to insert (POST) a new comment for a specific movie
// curl -X POST -H "Content-Type: application/json" -d '{"name": "Max Power", "email": "max@power.co", "text": "Love this post! Amazing! Lorem ipsum yabba dabba do."}' http://localhost:5000/movies/573a1390f29313caabcd4323/comments
router.post('/:id/comments', async (req, res, next) => {
  let resultStatus;
  let result = await movieData.createComment(req.params.id, req.body);

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
router.put('/:id', async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateById(req.params.id, req.body);

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Route to update (PUT) a single movie comment based on provided movie id
// curl -X PUT -H "Content-Type: application/json" -d '{"text": "This is an updated comment string"}' http://localhost:5000/movies/573a1390f29313caabcd4323/comments/62db05b2aa368c8697f4ca86
router.put('/:movieId/comments/:commentId', async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateCommentById(
    req.params.movieId,
    req.params.commentId,
    req.body
  );

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
// curl -X DELETE http://localhost:5000/movies/comments/62e04078667032e87b3e5834
router.delete('/:movieId', async (req, res, next) => {
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

// Route to remove (DELETE) a single comment
router.delete('/:movieId/comments/:commentId', async (req, res) => {
  const result = await movieData.deleteCommentById(
    req.params.movieId,
    req.params.commentId
  );

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
