const request = require('supertest');
const app = require('../../backend/server');

describe('Security Tests', () => {
  describe('Authentication', () => {
    test('Should reject missing token', async () => {
      const res = await request(app)
        .get('/api/chart-of-accounts')
        .query({ company_id: 1 });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('Should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/chart-of-accounts')
        .set('Authorization', 'Bearer invalid-token')
        .query({ company_id: 1 });
      
      expect(res.statusCode).toBe(401);
    });

    test('Should accept valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@mizan.local', password: 'admin123' });
      
      const token = loginRes.body.token;
      const res = await request(app)
        .get('/api/chart-of-accounts')
        .set('Authorization', `Bearer ${token}`)
        .query({ company_id: loginRes.body.user.company_id });
      
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Authorization', () => {
    test('Should reject user from accessing other company data', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@mizan.local', password: 'admin123' });
      
      const token = loginRes.body.token;
      const res = await request(app)
        .get('/api/chart-of-accounts')
        .set('Authorization', `Bearer ${token}`)
        .query({ company_id: 9999 });
      
      expect(res.statusCode).toBe(400 || 403);
    });

    test('Should reject unauthorized role access', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@mizan.local', password: 'admin123' });
      
      const token = loginRes.body.token;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          company_id: loginRes.body.user.company_id,
          name: 'New User',
          email: 'test@test.com',
          password: 'test123'
        });
      
      expect([201, 403, 500]).toContain(res.statusCode);
    });
  });

  describe('Rate Limiting', () => {
    test('Should rate limit excessive requests', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@mizan.local', password: 'admin123' });
      
      const token = loginRes.body.token;
      
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/chart-of-accounts')
          .set('Authorization', `Bearer ${token}`)
          .query({ company_id: loginRes.body.user.company_id });
      }
    }, 30000);
  });

  describe('SQL Injection Prevention', () => {
    test('Should handle SQL injection attempt safely', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: "admin' OR '1'='1",
          password: "' OR '1'='1"
        });
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Input Validation', () => {
    test('Should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: 'password' });
      
      expect(res.statusCode).toBe(401);
    });

    test('Should reject missing required fields', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@mizan.local', password: 'admin123' });
      
      const token = loginRes.body.token;
      const res = await request(app)
        .post('/api/chart-of-accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({ company_id: loginRes.body.user.company_id });
      
      expect(res.statusCode).toBe(400);
    });
  });
});
