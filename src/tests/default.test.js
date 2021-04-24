import request from 'supertest';
import app from '../server.js';


describe('Test default route', () => {
    test('It should return 200, correct message and type JSON', async () => {
        await request(app).get('/')
            .expect(200)
            .expect({ message: 'Tá on' })
            .expect('Content-Type', 'application/json; charset=utf-8');
    })
})