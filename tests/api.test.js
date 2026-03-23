const request = require('supertest');
const app = require('../index');

describe('Electricity API Comprehensive Test Suite', () => {
  
  // ============================================
  // API 1: Total electricity usages for each year
  // ============================================
  describe('API 1: GET /api/usage/total-by-year', () => {
    it('should return total electricity usage for each year with 200 status', async () => {
      const res = await request(app).get('/api/usage/total-by-year');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(!Array.isArray(res.body)).toBe(true);
    });

    it('should return object with year keys (e.g., "2566")', async () => {
      const res = await request(app).get('/api/usage/total-by-year');
      expect(res.body).toHaveProperty('2566');
      expect(typeof res.body['2566']).toBe('number');
    });

    it('total usage per year should be greater than zero', async () => {
      const res = await request(app).get('/api/usage/total-by-year');
      Object.values(res.body).forEach(value => {
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  // ============================================
  // API 2: Total electricity users for each year
  // ============================================
  describe('API 2: GET /api/users/total-by-year', () => {
    it('should return total electricity users for each year with 200 status', async () => {
      const res = await request(app).get('/api/users/total-by-year');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(!Array.isArray(res.body)).toBe(true);
    });

    it('should return object with year keys', async () => {
      const res = await request(app).get('/api/users/total-by-year');
      expect(res.body).toHaveProperty('2566');
      expect(typeof res.body['2566']).toBe('number');
    });

    it('total users per year should be greater than zero', async () => {
      const res = await request(app).get('/api/users/total-by-year');
      Object.values(res.body).forEach(value => {
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  // ============================================
  // API 3: Usage of specific province by specific year
  // ============================================
  describe('API 3: GET /api/usage/:province/:year', () => {
    it('should return usage data for Bangkok in year 2566', async () => {
      const res = await request(app).get('/api/usage/Bangkok/2566');
      expect(res.status).toBe(200);
      expect(res.body.province_name).toBe('Bangkok');
      expect(res.body.year).toBe(2566);
    });

    it('should return data structure with _kwh fields', async () => {
      const res = await request(app).get('/api/usage/Bangkok/2566');
      expect(res.body).toHaveProperty('residential_kwh');
      expect(res.body).toHaveProperty('small_business_kwh');
      expect(typeof res.body.residential_kwh).toBe('number');
    });

    it('should handle case-insensitive province names', async () => {
      const res1 = await request(app).get('/api/usage/Bangkok/2566');
      const res2 = await request(app).get('/api/usage/bangkok/2566');
      expect(res1.body.province_name).toBe(res2.body.province_name);
    });

    it('should return "Data not found" for non-existent province', async () => {
      const res = await request(app).get('/api/usage/NonExistent/2566');
      expect(res.body.message).toBe('Data not found');
    });

    it('should return "Data not found" for non-existent year', async () => {
      const res = await request(app).get('/api/usage/Bangkok/9999');
      expect(res.body.message).toBe('Data not found');
    });
  });

  // ============================================
  // API 4: Users of specific province by specific year
  // ============================================
  describe('API 4: GET /api/users/:province/:year', () => {
    it('should return user data for Bangkok in year 2566', async () => {
      const res = await request(app).get('/api/users/Bangkok/2566');
      expect(res.status).toBe(200);
      expect(res.body.province_name).toBe('Bangkok');
      expect(res.body.year).toBe(2566);
    });

    it('should return data structure with _count fields', async () => {
      const res = await request(app).get('/api/users/Bangkok/2566');
      expect(res.body).toHaveProperty('residential_count');
      expect(res.body).toHaveProperty('small_business_count');
      expect(typeof res.body.residential_count).toBe('number');
    });

    it('should handle case-insensitive province names', async () => {
      const res1 = await request(app).get('/api/users/Krabi/2566');
      const res2 = await request(app).get('/api/users/KRABI/2566');
      expect(res1.body.province_name).toBe(res2.body.province_name);
    });

    it('should return "Data not found" for non-existent province', async () => {
      const res = await request(app).get('/api/users/NonExistent/2566');
      expect(res.body.message).toBe('Data not found');
    });
  });

  // ============================================
  // API 5: Usage history by specific province
  // ============================================
  describe('API 5: GET /api/usage/history/:province', () => {
    it('should return usage history as an array', async () => {
      const res = await request(app).get('/api/usage/history/Bangkok');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return multiple year records for Bangkok', async () => {
      const res = await request(app).get('/api/usage/history/Bangkok');
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach(record => {
        expect(record.province_name.toLowerCase()).toBe('Bangkok'.toLowerCase());
        expect(record).toHaveProperty('year');
      });
    });

    it('should contain _kwh fields in each record', async () => {
      const res = await request(app).get('/api/usage/history/Bangkok');
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('residential_kwh');
      }
    });

    it('should handle case-insensitive province names', async () => {
      const res1 = await request(app).get('/api/usage/history/Bangkok');
      const res2 = await request(app).get('/api/usage/history/BANGKOK');
      expect(res1.body.length).toBe(res2.body.length);
    });

    it('should return empty array for non-existent province', async () => {
      const res = await request(app).get('/api/usage/history/NonExistent');
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  // ============================================
  // API 6: User history by specific province
  // ============================================
  describe('API 6: GET /api/users/history/:province', () => {
    it('should return user history as an array', async () => {
      const res = await request(app).get('/api/users/history/Bangkok');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return multiple year records for Bangkok', async () => {
      const res = await request(app).get('/api/users/history/Bangkok');
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach(record => {
        expect(record.province_name.toLowerCase()).toBe('Bangkok'.toLowerCase());
        expect(record).toHaveProperty('year');
      });
    });

    it('should contain _count fields in each record', async () => {
      const res = await request(app).get('/api/users/history/Bangkok');
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('residential_count');
      }
    });

    it('should handle case-insensitive province names', async () => {
      const res1 = await request(app).get('/api/users/history/Bangkok');
      const res2 = await request(app).get('/api/users/history/bangkok');
      expect(res1.body.length).toBe(res2.body.length);
    });

    it('should return empty array for non-existent province', async () => {
      const res = await request(app).get('/api/users/history/NonExistent');
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  // ============================================
  // Error Handling Tests
  // ============================================
  describe('Error Handling', () => {
    it('should handle missing required parameters gracefully', async () => {
      const res = await request(app).get('/api/usage/Bangkok');
      // This endpoint requires both province and year
      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should return valid JSON for all endpoints', async () => {
      const endpoints = [
        '/api/usage/total-by-year',
        '/api/users/total-by-year',
        '/api/usage/Bangkok/2566',
        '/api/users/Bangkok/2566',
        '/api/usage/history/Bangkok',
        '/api/users/history/Bangkok'
      ];

      for (const endpoint of endpoints) {
        const res = await request(app).get(endpoint);
        expect(res.headers['content-type']).toMatch(/json/);
      }
    });

    it('should not crash when accessing data with special characters', async () => {
      const res = await request(app).get('/api/usage/%20%20../2566');
      expect(res.status).toBeGreaterThanOrEqual(200);
    });
  });
});