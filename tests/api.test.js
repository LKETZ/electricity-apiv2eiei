const request = require('supertest');
const app = require('../index');

describe('Electricity API Endpoints', () => {

  // ─── API 1 ───────────────────────────────────────────────────────────────────
  describe('API 1: Total electricity usage for each year', () => {
    it('Valid: should return 200 with object of yearly totals', async () => {
      const res = await request(app).get('/api/usage/total-by-year');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(Array.isArray(res.body)).toBe(false); // should be plain object, not array
    });
    //ส่ง POST request แทน GET
    it('Invalid: should return 404 when using POST method', async () => {
      const res = await request(app).post('/api/usage/total-by-year');
      expect(res.status).toBe(404);
    });
  });

  // ─── API 2 ───────────────────────────────────────────────────────────────────
  describe('API 2: Total electricity users for each year', () => {
    //plain object เช่น { "2564": 5000, "2565": 5200 }
    it('Valid: should return 200 with object of yearly user totals', async () => {
      const res = await request(app).get('/api/users/total-by-year');
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(Array.isArray(res.body)).toBe(false);
    });
    ////ส่ง POST request แทน GET
    it('Invalid: should return 404 when using POST method', async () => {
      const res = await request(app).post('/api/users/total-by-year');
      expect(res.status).toBe(404);
    });
  });

  // ─── API 3 ───────────────────────────────────────────────────────────────────
  describe('API 3: Usage of specific province by specific year', () => {
    //response มี field province_name เป็น 'Bangkok' → ยืนยันว่าดึงข้อมูลถูกจังหวัด
    it('Valid: should return 200 with usage data for Bangkok in year 2566', async () => {
      const res = await request(app).get('/api/usage/Bangkok/2566');
      expect(res.status).toBe(200);
      expect(res.body.province_name).toBe('Bangkok');
    });
    //ส่งชื่อจังหวัดที่ไม่มีในฐานข้อมูล
    it('Invalid: should return 200 with "Data not found" message for non-existent province', async () => {
      const res = await request(app).get('/api/usage/InvalidProvince/2566');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Data not found');
    });
    //ส่งปีที่ไม่มีในข้อมูล
    /*
    it('Invalid: should return 200 with "Data not found" message for non-existent year', async () => {
      const res = await request(app).get('/api/usage/Bangkok/9999');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Data not found');
    });
    */
  });

  // ─── API 4 ───────────────────────────────────────────────────────────────────
  describe('API 4: Users of specific province by specific year', () => {
    //Users of specific province by specific year
    it('Valid: should return 200 with user data for Bangkok in year 2566', async () => {
      const res = await request(app).get('/api/users/Bangkok/2566');
      expect(res.status).toBe(200);
      expect(res.body.province_name).toBe('Bangkok');
    });
    //จังหวัดไม่มีในระบบ
    it('Invalid: should return 200 with "Data not found" message for non-existent province', async () => {
      const res = await request(app).get('/api/users/InvalidProvince/2566');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Data not found');
    });
    // ปีไม่มีในระบบ
    /*
    it('Invalid: should return 200 with "Data not found" message for non-existent year', async () => {
      const res = await request(app).get('/api/users/Bangkok/9999');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Data not found');
    });
    */
  });

  // ─── API 5 ───────────────────────────────────────────────────────────────────
  describe('API 5: Usage history by specific province', () => {
    //ดึงประวัติการใช้ไฟทุกปีของ Bangkok length > 0 → ยืนยันว่ามีข้อมูลจริงใน DB ไม่ใช่ array เปล่า
    it('Valid: should return 200 with array of usage history for Bangkok', async () => {
      const res = await request(app).get('/api/usage/history/Bangkok');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
    //.filter() ไม่เจอข้อมูลใดเลย → return [] (empty array)
    it('Invalid: should return 200 with empty array for non-existent province', async () => {
      const res = await request(app).get('/api/usage/history/InvalidProvince');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  // ─── API 6 ───────────────────────────────────────────────────────────────────
  describe('API 6: User history by specific province', () => {
    it('Valid: should return 200 with array of user history for Bangkok', async () => {
      const res = await request(app).get('/api/users/history/Bangkok');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('Invalid: should return 200 with empty array for non-existent province', async () => {
      const res = await request(app).get('/api/users/history/InvalidProvince');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

});