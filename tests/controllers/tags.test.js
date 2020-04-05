const request = require('supertest')
const app = require('../../src/api/app')

describe('Tags Endpoint(s)', () => {
  describe('Read Tag', () => {
    test('should return HTTP 200 status code if found', async () => {
      const res = await request(app).get('/v1/tags/2')
      expect(res.status).toBe(200)
    })
    test('should return a `tag` object', async () => {
      const res = await request(app).get('/v1/tags/2')
      expect(res.body.payload).toHaveProperty('tag')
      expect(typeof res.body.payload.tag).toBe('object')
    })

    test('should return HTTP 404 status code if not found', async () => {
      const res = await request(app).get('/v1/tags/98763')
      expect(res.status).toBe(404)
    })
    test('should return an `error` object', async () => {
      const res = await request(app).get('/v1/tags/98763')
      expect(res.body).toHaveProperty('error')
      expect(typeof res.body.error).toBe('object')
      expect(res.body.error).toHaveProperty('message')
      expect(res.body.error).toHaveProperty('status', 404)
    })
  })
  describe('Browse Tags', () => {
    test('should return HTTP 200 status code', async () => {
      const res = await request(app).get('/v1/tags')
      expect(res.status).toBe(200)
    })
    test('should return an array of tags', async () => {
      const res = await request(app).get('/v1/tags')
      expect(res.body.payload).toHaveProperty('tags')
      expect(Array.isArray(res.body.payload.tags)).toBeTruthy()
    })
  })
})
