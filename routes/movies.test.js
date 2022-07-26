const request = require('supertest');
const server = require('../server');

jest.mock('../dataInterface/movies');
const movieData = require('../dataInterface/movies');
const { ServerDescription } = require('mongodb');

describe('/movies routes', () => {
  beforeEach(() => {});

  describe('GET /', () => {
    it('should return an array on success', async () => {
      movieData.getAll.mockResolvedValue([{ _id: '890', title: 'One Day' }]);
      const res = await request(server).get('/movies');

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error message on error', async () => {
      movieData.getAll.mockResolvedValue(null);
      const res = await request(server).get('/movies');

      expect(res.statusCode).toEqual(500);
    });
  });

  describe('GET /comments', () => {
    it('should return an array of comments', async () => {
      movieData.getAllComments.mockResolvedValue([
        { _id: 'abc123', movie_id: 'abc123' },
      ]);
      const res = await request(server).get('/movies/comments');
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.statusCode).toEqual(200);
    });

    it('should return error if associated movie is not found', async () => {
      movieData.getAllComments.mockResolvedValue([]);
      const res = await request(server).get('/movies/comments');
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.statusCode).toEqual(400);
    });

    it('should return an error if server call returns null', async () => {
      movieData.getAllComments.mockResolvedValue(null);
      const res = await request(server).get('/movies/comments');
      expect(Array.isArray(res.body)).not.toEqual(true);
      expect(res.status).toEqual(500);
    });
  });

  describe('GET /:id', () => {
    it('should return a single movie on success', async () => {
      movieData.getById.mockResolvedValue([{ _id: '890', title: 'One Day' }]);
      const res = await request(server).get('/movies/890');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined;
      expect(res.body.length).toEqual(1);
    });

    it('should return a status code of 404 if movie not found', async () => {
      movieData.getById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });

      const res = await request(server).get('/movies/111');
      expect(res.statusCode).toEqual(404);
      expect(res.error).toBeDefined;
    });
  });

  describe('GET /:id/comments', () => {
    it('should return array of movie comments on success (possibly empty)', async () => {
      movieData.getMovieComments.mockResolvedValue([
        {
          _id: '890',
          name: 'Max Power',
          email: 'max@power.co',
          movie_id: 'abc123',
        },
      ]);
      const res = await request(server).get('/movies/890/comments');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error if movie not found', async () => {
      movieData.getMovieComments.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });

      const res = await request(server).get('/movies/890/comments');
      expect(res.statusCode).toEqual(400);
      expect(res.error).toBeDefined;
    });

    it('should return a 500 error for null response from server', async () => {
      movieData.getMovieComments.mockResolvedValue(null);

      const res = await request(server).get('/movies/890/comments');
      expect(res.statusCode).toEqual(500);
      expect(res.error).not.toBeDefined;
    });
  });

  describe('POST /', () => {
    it('should return the new movie on success', async () => {
      movieData.createMovie.mockResolvedValue([
        { title: 'Test movie title', plot: 'Test movie plot' },
      ]);
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
    });

    it('should return an error message if title not sent in body', async () => {
      movieData.createMovie.mockResolvedValue({
        error: 'Movies must have a title.',
      });
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined;
    });

    it('should return an error message if movie fails to be created', async () => {
      movieData.createMovie.mockResolvedValue(null);
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(500);
      expect(res.body).not.toBeDefined;
    });
  });

  describe('POST /:id/comments', () => {
    it('should return the new comment and a 200 response on success', async () => {
      movieData.createComment.mockResolvedValue({
        _id: '123',
        name: 'Max Power',
        email: 'max@power.co',
        text: 'Test',
        movie_id: '456',
        date: '2022-07-26T19:28:56.981Z',
      });
      const res = await request(server).post('/movies/123/comments');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeDefined;
      expect(res.body._id).toBeDefined;
      expect(res.body.name).toBeDefined;
      expect(res.body.email).toBeDefined;
      expect(res.body.text).toBeDefined;
      expect(res.body.movie_id).toBeDefined;
      expect(res.body.date).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error message and 400 response if movie not found', async () => {
      movieData.createComment.mockResolvedValue({
        error: `There was an error submitting comment data. Please try again later.`,
      });
      const res = await request(server).post('/movies/123/comments');
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined;
    });

    it('should return an error message and 500 response if server returns null', async () => {
      movieData.createComment.mockResolvedValue(null);
      const res = await request(server).post('/movies/123/comments');
      expect(res.statusCode).toEqual(500);
      expect(res.body).not.toBeDefined;
    });
  });

  describe('PUT /:id', () => {
    it('should return the updated movie and 200 response on success', async () => {
      movieData.updateById.mockResolvedValue({
        _id: '890',
        title: 'Updated movie title',
      });
      const res = await request(server).put('/movies/890');
      expect(res.status).toEqual(200);
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error message and 400 response if movie fails to be updated', async () => {
      movieData.updateById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });
      const res = await request(server).put('/movies/890');
      expect(res.status).toEqual(400);
      expect(res.error).toBeDefined;
    });
  });

  describe('PUT /:movieId/comments/:commentId', () => {
    it('should return the updated comment and 200 response on success', async () => {
      movieData.updateCommentById.mockResolvedValue({
        _id: '890',
        name: 'Max Power',
        email: 'max@power.co',
        text: 'Updated comment text',
      });
      const res = await request(server).put('/movies/123/comments/456');
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error message and 400 response if comment fails to be updated', async () => {
      movieData.updateCommentById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });
      const res = await request(server).put('/movies/123/comments/456');
      expect(res.status).toEqual(400);
      expect(res.error).toBeDefined;
    });

    it('should return a 500 response if server returns null', async () => {
      movieData.updateCommentById.mockResolvedValue(null);
      const res = await request(server).put('/movies/123/comments/456');
      expect(res.status).toEqual(500);
    });
  });

  describe('DELETE /:id', () => {
    it('should return a message on success', async () => {
      movieData.deleteById.mockResolvedValue({
        message: 'Movie successfully deleted.',
      });
      const res = await request(server).delete('/movies/890');
      expect(res.status).toEqual(200);
      expect(res.message).toBeDefined;
      expect(res.error).not.toBeDefined;
    });

    it('should return an error message if movie fails to be deleted', async () => {
      movieData.deleteById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });
      const res = await request(server).delete('/movies/890');
      expect(res.status).toEqual(400);
      expect(res.message).not.toBeDefined;
      expect(res.error).toBeDefined;
    });
  });
});
