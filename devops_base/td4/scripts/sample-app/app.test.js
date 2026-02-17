const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  test('should respond to the GET method', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
test('should respond with JSON Hello, World!', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(200);
  expect(res.headers['content-type']).toMatch(/json/);
  expect(res.body).toEqual({ message: "Hello, World!" });
});

describe('GET /name/:name', () => {
  test('should respond with a personalized greeting', async () => {
    const res = await request(app).get('/name/Lucas');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello, Lucas!');
  });
});

describe('GET /add/:a/:b', () => {
  test('should return the sum for valid integers', async () => {
    const res = await request(app).get('/add/2/3');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('5');
  });

  test('should work with negative numbers', async () => {
    const res = await request(app).get('/add/-2/10');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('8');
  });

  test('should return 400 for non-numeric input', async () => {
    const res = await request(app).get('/add/foo/3');
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Invalid input');
  });
});
describe('Negative tests', () => {
  test('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown-route');

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Not Found');
  });
});

