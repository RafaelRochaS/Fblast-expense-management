import supertest from 'supertest';
import app from '../server.js';
import db from '../database/connection.js';

const api = supertest(app);

const testUser = {
    username: 'TestUser',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@user.com',
    password: '123456'
};

const USER_API = '/api/v1/users';
const TEST_ID = 2;
const TEST_NAME = 'TestUpdate';

describe('/api/v1/users', () => {

    afterAll(done => {
        db.destroy();
        done();
    })

    test('returns default user', async () => {

        await api.get(USER_API)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).toContainEqual({ username: 'Joe da Quebrada' });
            });
    });

    test('add user successfully', async () => {
        await api.put(USER_API)
            .send(testUser)
            .expect(201);
    });

    test('returns new user', async () => {

        await api.get(USER_API)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).toContainEqual({ username: 'TestUser' });
            });
    });

    test('updates new user', async() => {

        await api.patch(USER_API + `/${TEST_ID}`)
            .send({ name: TEST_NAME})
            .expect(200);
    })

});

