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

const testUserInvalid = {   // user without last name
    username: 'TestUser',
    first_name: 'Test',
    email: 'test@user.com',
    password: '123456'
};

const USER_API = '/api/v1/users';
const TEST_NAME = 'TestUpdate';
const DEFAULT_USER_NAME = 'Joe da Quebrada';

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

    test('returns default user by id', async () => {

        let default_id;

        await db('users')
            .select('id')
            .where({ username: DEFAULT_USER_NAME })
            .then(data => {
                default_id = data;
            });

        await api.get(`${USER_API}/${default_id[0].id}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(expect(response.body).toMatchObject([{ username: 'Joe da Quebrada' }]));
            });
    });

    test('returns defualt user by username', async () => {

        await api.get(`${USER_API}/?user=${DEFAULT_USER_NAME}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(expect(response.body).toMatchObject([{ username: 'Joe da Quebrada' }]));
            });
    });

    test('add user successfully', async () => {
        await api.post(USER_API)
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

        await api.put(`${USER_API}/${test_id[0].id}`)
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

    test('does not create user with missing values', async () => {

        await api.post(USER_API)
            .send(testUserInvalid)
            .expect(400);
    });

    test('reject update on unexisting id', async () => {

        let invalidId = await getInvalidId();

        await api.put(`${USER_API}/${invalidId}`)
            .send({ username: TEST_NAME })
            .expect(404);
    });

    test('return 404 on deleting unexistent user', async () => {

        let invalidId = await getInvalidId();

        await api.delete(`${USER_API}/${invalidId}`)
            .expect(404);
    });
});

async function getInvalidId() {

    let invalidId;

    await db('users')
        .select('id')
        .orderBy('id', 'desc')
        .first()
        .then(data => invalidId = data);

    invalidId = invalidId.id + 1;

    return invalidId;
}