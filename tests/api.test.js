const request = require('supertest');
const app = require('../index');

describe('Electricity API Endpoints', () => {
  // API 1: Total electricity usages for each year
  it('API 1: should return total electricity usage for each year', async () => {
    const res = await request(app).get('/api/usage/total-by-year');
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });

  // API 2: Total electricity users for each year
  it('API 2: should return total electricity users for each year', async () => {
    const res = await request(app).get('/api/users/total-by-year');
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe('object');
  });

  // API 3: Usage of specific province by specific year
  it('API 3: should return usage for specific province and year', async () => {
    const res = await request(app).get('/api/usage/Bangkok/2566');
    expect(res.status).toBe(200);
    expect(res.body.province_name).toBe('Bangkok');
  });

  // API 4: Users of specific province by specific year
  it('API 4: should return users for specific province and year', async () => {
    const res = await request(app).get('/api/users/Bangkok/2566');
    expect(res.status).toBe(200);
    expect(res.body.province_name).toBe('Bangkok');
  });

  // API 5: Usage history by specific province
  it('API 5: should return usage history for specific province', async () => {
    const res = await request(app).get('/api/usage/history/Bangkok');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // API 6: User history by specific province
  it('API 6: should return user history for specific province', async () => {
    const res = await request(app).get('/api/users/history/Bangkok');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Error Handling
  it('Error Handling: should handle missing required parameters', async () => {
    const res = await request(app).get('/api/usage/Bangkok');
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});