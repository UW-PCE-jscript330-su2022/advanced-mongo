const request = require('supertest');
const server = require('../server');

jest.mock('../dataInterface/movies');
const movieData = require('../dataInterface/movies');

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

  describe('POST /', () => {
    it('should return the new movie on success', async () => {
      movieData.create.mockResolvedValue([
        { title: 'Test movie title', plot: 'Test movie plot' },
      ]);
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
    });

    it('should return an error message if title not sent in body', async () => {
      movieData.create.mockResolvedValue({
        error: 'Movies must have a title.',
      });
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined;
    });

    it('should return an error message if movie fails to be created', async () => {
      movieData.create.mockResolvedValue(null);
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('PUT /:id', () => {
    it('should return the updated movie on success', async () => {
      expect(false).toEqual(true);
    });

    it('should return an error message if movie fails to be updated', async () => {
      expect(false).toEqual(true);
    });
  });

  describe('DELETE /:id', () => {
    it('should return a message on success', async () => {
      expect(false).toEqual(true);
    });

    it('should return an error message if movie fails to be deleted', async () => {
      expect(false).toEqual(true);
    });
  });
});
