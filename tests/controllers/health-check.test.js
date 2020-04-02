const request = require('supertest')
const app = require('../../src/api/app')

describe('Health Check Endpoint(s)', () => {
  test('should return a successful response', async () => {
    const res = await request(app).get('/v1/status')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'success')
  })
})
