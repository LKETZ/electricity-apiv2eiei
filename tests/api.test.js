const request = require('supertest');
const app = require('../index');

describe('Electricity API Endpoints', () => {

  describe('API 1: Total electricity usage for each year', () => {
    it('Valid: should return total electricity usage for each year', async () => {
      const res = await request(app).get('/api/usage/total-by-year');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
    });

    it('Invalid: should reject POST method', async () => {
      const res = await request(app).post('/api/usage/total-by-year');
      expect(res.status).toBe(404);
    });
  });

  describe('API 2: Total electricity users for each year', () => {
    it('Valid: should return total electricity users for each year', async () => {
      const res = await request(app).get('/api/users/total-by-year');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
    });

    it('Invalid: should reject POST method', async () => {
      const res = await request(app).post('/api/users/total-by-year');
      expect(res.status).toBe(404);
    });
  });

  describe('API 3: Usage of specific province by specific year', () => {
    it('Valid: should return usage for specific province and year', async () => {
      const res = await request(app).get('/api/usage/Bangkok/2566');
      expect(res.status).toBe(200);
      expect(res.body.province_name).toBe('Bangkok');
    });

    it('Invalid: should handle missing year', async () => {
      const res = await request(app).get('/api/usage/Bangkok');
      expect(res.status).toBe(404);
    });
  });

  describe('API 4: Users of specific province by specific year', () => {
    it('Valid: should return users for specific province and year', async () => {
      const res = await request(app).get('/api/users/Bangkok/2566');
      expect(res.status).toBe(200);
      expect(res.body.province_name).toBe('Bangkok');
    });

    it('Invalid: should handle missing year', async () => {
      const res = await request(app).get('/api/users/Bangkok');
      expect(res.status).toBe(404);
    });
  });

  describe('API 5: Usage history by specific province', () => {
    it('Valid: should return usage history for specific province', async () => {
      const res = await request(app).get('/api/usage/history/Bangkok');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('Invalid: should handle invalid province', async () => {
      const res = await request(app).get('/api/usage/history/InvalidProvince');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('API 6: User history by specific province', () => {
    it('Valid: should return user history for specific province', async () => {
      const res = await request(app).get('/api/users/history/Bangkok');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('Invalid: should handle invalid province', async () => {
      const res = await request(app).get('/api/users/history/InvalidProvince');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

});