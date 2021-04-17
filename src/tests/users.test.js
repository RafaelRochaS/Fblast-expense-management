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
                expect(response.body).toMatchObject([{ username: 'Joe da Quebrada' }]);
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
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ username: 'TestUser' })
                    ])
                )
            });
    });

    test('updates new user', async () => {

        let test_id;

        await db('users')
            .select('id')
            .where({ username: 'TestUser' })
            .then(data => {
                test_id = data;
            });

        await api.patch(`${USER_API}/${test_id[0].id}`)
            .send({ username: TEST_NAME })
            .expect(200);
    });

    test('returns updated user', async () => {

        await api.get(USER_API)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ username: TEST_NAME })
                    ])
                )
            });

    });

    test('deletes test user', async () => {

        let test_id;

        await db('users')
            .select('id')
            .where({ username: TEST_NAME })
            .then(data => {
                test_id = data;
            });

        await api.delete(`${USER_API}/${test_id[0].id}`)
            .expect(200);
    });

    test('does not returns test user', async () => {

        await api.get(USER_API)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).not.toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ username: TEST_NAME })
                    ])
                )
            });

    });
});
