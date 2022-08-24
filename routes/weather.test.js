const request = require('supertest');
const server = require('../server');

jest.mock('../dataInterface/weather');
const weatherData = require('../dataInterface/weather');
const { ServerDescription } = require('mongodb');

describe('tests for all /weather routes', () => {
  beforeEach(() => {});

  describe('GET /', () => {
    it('should return an array of weather reports and a 200 response on success', async () => {
      weatherData.getWeatherReports.mockResolvedValue([
        {
          _id: '5553a998e4b02cf715119403',
          st: 'x+48900-050500',
          ts: '1984-03-06T00:00:00.000Z',
          position: { type: 'Point', coordinates: [-50.5, 48.9] },
          elevation: 9999,
          callLetters: 'VCSZ',
          qualityControlProcess: 'V020',
          dataSource: '4',
          type: 'FM-13',
          airTemperature: { value: -6.4, quality: '1' },
          dewPoint: { value: 999.9, quality: '9' },
          pressure: { value: 1018.8, quality: '1' },
          wind: {
            direction: { angle: 999, quality: '9' },
            type: '9',
            speed: { rate: 999.9, quality: '9' },
          },
          visibility: {
            distance: { value: 999999, quality: '9' },
            variability: { value: 'N', quality: '9' },
          },
          skyCondition: {
            ceilingHeight: { value: 99999, quality: '9', determination: '9' },
            cavok: 'N',
          },
          sections: ['AG1'],
          precipitationEstimatedObservation: {
            discrepancy: '2',
            estimatedWaterDepth: 0,
          },
        },
      ]);
      const res = await request(server).get('/weather');

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body[0]._id).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    describe('GET /', () => {
      it('should return an array of weather reports meeting the specific criteria and a 200 response on success', async () => {
        weatherData.getWeatherReports.mockResolvedValue([
          {
            _id: '5553a998e4b02cf715119403',
            callLetters: 'VCSZ',
            airTemperature: { value: -6.4 },
            sections: ['AG1'],
          },
        ]);
        const res = await request(server).get(
          '/weather?minAirTemp=-6.4&maxAirTemp=-6.4&section=AG1&callLetters=VCSZ'
        );

        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body[0]._id).toBeDefined;
        expect(res.body.error).not.toBeDefined;
      });
    });

    it('should return an empty array and a 400 response if no weather reports found', async () => {
      weatherData.getWeatherReports.mockResolvedValue([]);
      const res = await request(server).get('/weather?callLetters=XYXY');

      expect(res.status).toEqual(400);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body[0]).not.toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an error and a 422 response if invalid query string submitted', async () => {
      weatherData.getWeatherReports.mockResolvedValue({
        error: `Minimum air temp cannot be greater than maximum air temp. Please try again.`,
      });
      const res = await request(server).get(
        '/weather?minAirTemp=99&maxAirTemp=0'
      );

      expect(res.status).toEqual(422);
      expect(Array.isArray(res.body)).not.toEqual(true);
      expect(res.body[0]).not.toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return a 500 response if server call returns null', async () => {
      weatherData.getWeatherReports.mockResolvedValue(null);
      const res = await request(server).get('/weather');

      expect(res.statusCode).toEqual(500);
      expect(res.body).not.toBeDefined;
    });
  });

  describe('GET /:callLetters', () => {
    it('should return an array of weather reports and a 200 response on success', async () => {
      weatherData.getWeatherByCallLetters.mockResolvedValue([
        {
          _id: '5553a998e4b02cf715119403',
          st: 'x+48900-050500',
          ts: '1984-03-06T00:00:00.000Z',
          position: { type: 'Point', coordinates: [-50.5, 48.9] },
          elevation: 9999,
          callLetters: 'VCSZ',
          qualityControlProcess: 'V020',
          dataSource: '4',
          type: 'FM-13',
          airTemperature: { value: -6.4, quality: '1' },
          dewPoint: { value: 999.9, quality: '9' },
          pressure: { value: 1018.8, quality: '1' },
          wind: {
            direction: { angle: 999, quality: '9' },
            type: '9',
            speed: { rate: 999.9, quality: '9' },
          },
          visibility: {
            distance: { value: 999999, quality: '9' },
            variability: { value: 'N', quality: '9' },
          },
          skyCondition: {
            ceilingHeight: { value: 99999, quality: '9', determination: '9' },
            cavok: 'N',
          },
          sections: ['AG1'],
          precipitationEstimatedObservation: {
            discrepancy: '2',
            estimatedWaterDepth: 0,
          },
        },
      ]);
      const res = await request(server).get('/weather/VCSZ');

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body[0]._id).toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return an empty array and a 400 response if no weather reports found', async () => {
      weatherData.getWeatherByCallLetters.mockResolvedValue([]);
      const res = await request(server).get('/weather/VCSZ');

      expect(res.status).toEqual(400);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body[0]).not.toBeDefined;
      expect(res.body.error).not.toBeDefined;
    });

    it('should return a 500 response if server call returns null', async () => {
      weatherData.getWeatherByCallLetters.mockResolvedValue(null);
      const res = await request(server).get('/weather/VCSZ');

      expect(res.statusCode).toEqual(500);
      expect(res.body).not.toBeDefined;
    });
  });

  describe('POST /', () => {
    it('should return the _id value of the new weather report and 200 response on success', async () => {
      weatherData.createWeatherReport.mockResolvedValue([
        { _id: '62e986a719e4415334232b8d' },
      ]);
      const res = await request(server).post('/weather');
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toBeDefined;
      expect(Array.isArray(res.body)).toEqual(true);
    });

    it('should return an error message and 400 response if connected to server, but insertion not acknowleged', async () => {
      weatherData.createWeatherReport.mockResolvedValue({
        error: 'Something went wrong. Please try again.',
      });
      const res = await request(server).post('/movies');
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined;
    });

    it('should return a 500 response if server returns null', async () => {
      weatherData.createWeatherReport.mockResolvedValue(null);
      const res = await request(server).post('/weather');
      expect(res.statusCode).toEqual(500);
      expect(res.body).not.toBeDefined;
    });
  });
});
