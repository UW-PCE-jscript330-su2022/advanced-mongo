const request = require('supertest');
const server = require('../server');

jest.mock('../dataInterface/movies');
const movieData = require('../dataInterface/movies');
const { ServerDescription } = require('mongodb');

describe('/movies routes', () => {
  beforeEach(() => {});

  describe('GET /', () => {
    it('should return an array of movies and a 200 response on success', async () => {
      movieData.getAllMovies.mockResolvedValue([
        { _id: 'abc123', title: 'Test movie title' },
      ]);
      const res = await request(server).get('/movies');

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body[0]._id).toBeDefined;
      expect(res.body[0].title).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return a 500 response if server call returns null', async () => {
      movieData.getAllMovies.mockResolvedValue(null);
      const res = await request(server).get('/movies');

      expect(res.statusCode).toEqual(500);
    });
  });

  describe('GET /:id', () => {
    it('should return movie object and 200 response on success', async () => {
      movieData.getMovieById.mockResolvedValue([
        { _id: '890', title: 'One Day' },
      ]);
      const res = await request(server).get('/movies/890');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]._id).toBeDefined;
      expect(res.body[0].title).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error and 404 response if movie not found', async () => {
      movieData.getMovieById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });

      const res = await request(server).get('/movies/111');
      expect(res.statusCode).toEqual(404);
      expect(res.error).toBeDefined;
    });
  });

  describe('/genres/:genreName', () => {
    it('should return an array of movies and 200 response on success', async () => {
      movieData.getMoviesByGenre.mockResolvedValue([
        {
          _id: 'abc123',
          genres: ['Short', 'Drama', 'Fantasy'],
          title: 'Test movie',
        },
      ]);
      const res = await request(server).get('/movies/genres/Short');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body[0]._id).toBeDefined;
      expect(res.body[0].genres).toBeDefined;
      expect(res.body[0].title).toBeDefined;
    });

    it('should return an error and a 400 response if no movies match genre', async () => {
      movieData.getMoviesByGenre.mockResolvedValue([]);
      const res = await request(server).get('/movies/genres/Short');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeDefined;
    });

    it('should return a 500 response if server returns null', async () => {
      movieData.getMoviesByGenre.mockResolvedValue(null);
      const res = await request(server).get('/movies/genres/Short');
      expect(res.statusCode).toEqual(500);
      expect(res.body).not.toBeDefined;
    });
  });

  describe('GET /:id/comments', () => {
    it('should return array of movie comments and 200 response on success (possibly empty)', async () => {
      movieData.getMovieComments.mockResolvedValue([
        {
          _id: 'abc123',
          name: 'Max Power',
          email: 'max@power.co',
          text: 'Test comment',
          movie_id: 'abc123',
          date: '2022-07-26T18:34:00.343Z',
        },
      ]);
      const res = await request(server).get('/movies/890/comments');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body[0]._id).toBeDefined;
      expect(res.body[0].name).toBeDefined;
      expect(res.body[0].email).toBeDefined;
      expect(res.body[0].text).toBeDefined;
      expect(res.body[0].movie_id).toBeDefined;
      expect(res.body[0].date).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error and 400 response if movie not found', async () => {
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
    it('should return the new movie and 200 response on success', async () => {
      movieData.createMovie.mockResolvedValue([
        { _id: 'abc123', title: 'Test movie title' },
      ]);
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toBeDefined;
      expect(res.body.title).toBeDefined;
      expect(Array.isArray(res.body)).toEqual(true);
    });

    it('should return an error message and 400 response if title not sent in body', async () => {
      movieData.createMovie.mockResolvedValue({
        error: 'Movies must have a title.',
      });
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined;
    });

    it('should return a 500 response if server returns null', async () => {
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
      movieData.updateMovieById.mockResolvedValue({
        _id: '890',
        title: 'Updated movie title',
      });
      const res = await request(server).put('/movies/890');
      expect(res.status).toEqual(200);
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error message and 400 response if movie fails to be updated', async () => {
      movieData.updateMovieById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });
      const res = await request(server).put('/movies/890');
      expect(res.status).toEqual(400);
      expect(res.error).toBeDefined;
    });
  });

  describe('DELETE /:movieId', () => {
    it('should return a message on success', async () => {
      movieData.deleteMovieById.mockResolvedValue(
        'Movie successfully deleted.'
      );
      const res = await request(server).delete('/movies/abc123');
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined;
      expect(res.error).not.toBeDefined;
    });

    it('should return an error message and 400 response if movie fails to be deleted', async () => {
      movieData.deleteMovieById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });
      const res = await request(server).delete('/movies/abc123');
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined;
      expect(res.error).toBeDefined;
    });

    it('should return a 500 response if server returns null', async () => {
      movieData.deleteMovieById.mockResolvedValue(null);
      const res = await request(server).delete('/movies/abc123');
      expect(res.status).toEqual(500);
    });
  });
});
