const request = require('supertest');
const server = require('../server');

jest.mock('../dataInterface/comments');
const commentData = require('../dataInterface/comments');
const { ServerDescription } = require('mongodb');

describe('/comments routes', () => {
  beforeEach(() => {});

  describe('GET /', () => {
    it('should return an array of comments and 200 response on success', async () => {
      commentData.getAllComments.mockResolvedValue([
        {
          _id: 'abc123',
          name: 'Max Power',
          email: 'max@power.co',
          text: 'Test comment',
          movie_id: 'abc123',
          date: '2022-07-26T18:34:00.343Z',
        },
      ]);
      const res = await request(server).get('/comments');
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

    it('should return error and 400 response if associated movie is not found', async () => {
      commentData.getAllComments.mockResolvedValue([]);
      const res = await request(server).get('/comments');
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.statusCode).toEqual(400);
    });

    it('should return a 500 response if server call returns null', async () => {
      commentData.getAllComments.mockResolvedValue(null);
      const res = await request(server).get('/comments');
      expect(Array.isArray(res.body)).not.toEqual(true);
      expect(res.status).toEqual(500);
    });
  });

  describe('PUT /:commentId', () => {
    it('should return the updated comment and 200 response on success', async () => {
      commentData.updateCommentById.mockResolvedValue({
        _id: '890',
        name: 'Max Power',
        email: 'max@power.co',
        text: 'Updated comment text',
      });
      const res = await request(server).put('/comments/456');
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error message and 400 response if comment fails to be updated', async () => {
      commentData.updateCommentById.mockResolvedValue({
        error: `We've encountered an error. Please try again later.`,
      });
      const res = await request(server).put('/comments/456');
      expect(res.status).toEqual(400);
      expect(res.error).toBeDefined;
    });

    it('should return a 500 response if server returns null', async () => {
      commentData.updateCommentById.mockResolvedValue(null);
      const res = await request(server).put('/comments/456');
      expect(res.status).toEqual(500);
    });
  });

  describe('DELETE /:commentId', () => {
    it('should return a message on success', async () => {
      commentData.deleteCommentById.mockResolvedValue(
        `Comment with id of abc123 successfully deleted.`
      );
      const res = await request(server).delete('/comments/abc123');
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined;
      expect(res.error).not.toBeDefined;
    });

    it('should return an error message and 400 response if movie fails to be deleted', async () => {
      commentData.deleteCommentById.mockResolvedValue({
        error: `There was an error deleting this comment. Please try again later.`,
      });
      const res = await request(server).delete('/comments/abc123');
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined;
      expect(res.error).toBeDefined;
    });

    it('should return a 500 response if server returns null', async () => {
      commentData.deleteCommentById.mockResolvedValue(null);
      const res = await request(server).delete('/comments/abc123');
      expect(res.status).toEqual(500);
    });
  });
});
