const { Router } = require('express');
const router = Router();
const commentData = require('../dataInterface/comments');

// Route to retrieve (GET) all comments for all movies
// curl http://localhost:5000/comments
router.get('/', async (req, res) => {
  let resultStatus;
  const result = await commentData.getAllComments();

  if (result === null) {
    resultStatus = 500;
  } else if (result.length === 0) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// Route to retrieve (GET) a single comment by id
// curl http://localhost:5000/comments/62e037adf7dd2605c858b38c
router.get('/:id', async (req, res) => {
  let resultStatus;
  const result = await commentData.getCommentById(req.params.id);

  if (result === null) {
    resultStatus = 500;
  } else if (result.error) {
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }
  res.status(resultStatus).send(result);
});

// Route to update (PUT) a single movie comment based on id
// curl -X PUT -H "Content-Type: application/json" -d '{"text": "This is an updated comment string"}' http://localhost:5000/comments/62e037adf7dd2605c858b38c
router.put('/:commentId', async (req, res) => {
  let resultStatus;
  const result = await commentData.updateCommentById(
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

// Route to remove (DELETE) a single comment
// curl -X DELETE http://localhost:5000/comments/62e037adf7dd2605c858b38c
router.delete('/:commentId', async (req, res) => {
  const result = await commentData.deleteCommentById(req.params.commentId);

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
