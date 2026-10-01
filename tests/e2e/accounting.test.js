const request = require('supertest');
const app = require('../../backend/server');
const db = require('../../backend/config/database');

describe('Accounting Module E2E Tests', () => {
  let token, companyId, accountId, entryId;

  beforeAll(async () => {
    // Login and get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@mizan.local', password: 'admin123' });
    
    token = loginRes.body.token;
    companyId = loginRes.body.user.company_id;
  });

  describe('Chart of Accounts', () => {
    test('GET /api/chart-of-accounts - Should retrieve all accounts', async () => {
      const res = await request(app)
        .get('/api/chart-of-accounts')
        .set('Authorization', `Bearer ${token}`)
        .query({ company_id: companyId });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('POST /api/chart-of-accounts - Should create new account', async () => {
      const res = await request(app)
        .post('/api/chart-of-accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          company_id: companyId,
          account_code: '5555',
          account_name: 'Test Account',
          account_type: 'expense'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.account_code).toBe('5555');
      accountId = res.body.data.id;
    });
  });

  describe('Journal Entries', () => {
    test('POST /api/journal-entries - Should create journal entry', async () => {
      const res = await request(app)
        .post('/api/journal-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
          company_id: companyId,
          description: 'Test Journal Entry',
          lines: [
            { account_id: 1, debit: 1000, credit: 0 },
            { account_id: 2, debit: 0, credit: 1000 }
          ]
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      entryId = res.body.data.id;
    });

    test('GET /api/journal-entries - Should retrieve all entries', async () => {
      const res = await request(app)
        .get('/api/journal-entries')
        .set('Authorization', `Bearer ${token}`)
        .query({ company_id: companyId });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('POST /api/journal-entries/:id/post - Should post entry', async () => {
      const res = await request(app)
        .post(`/api/journal-entries/${entryId}/post`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('posted');
    });
  });

  describe('Trial Balance', () => {
    test('GET /api/reports/trial-balance - Should retrieve trial balance', async () => {
      const res = await request(app)
        .get('/api/reports/trial-balance')
        .set('Authorization', `Bearer ${token}`)
        .query({ company_id: companyId });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accounts).toBeDefined();
      expect(res.body.data.totals).toBeDefined();
      expect(Number(res.body.data.totals.debit)).toBe(Number(res.body.data.totals.credit));
    });
  });

  describe('Validation', () => {
    test('Should reject unbalanced journal entry', async () => {
      const res = await request(app)
        .post('/api/journal-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
          company_id: companyId,
          description: 'Unbalanced Entry',
          lines: [
            { account_id: 1, debit: 1000, credit: 0 },
            { account_id: 2, debit: 0, credit: 500 }
          ]
        });
      
      expect(res.statusCode).toBe(400 || 500);
    });
  });
});
