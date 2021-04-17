import db from '../database/connection.js';

export async function index(request, response) {

    let users;

    try {
        await db('users')
            .select('username')
            .then(data => {
                users = data;
            });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error'});
    }

    response.status(200).json(users);
}

export async function create(request, response) {

    const {
        username,
        first_name,
        last_name,
        email,
        password
    } = request.body;

    //check if any value is missing

    const trx = await db.transaction();

    try {

        await trx('users').insert({
            username: username,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        });

        await trx.commit();

        response.status(201).send();

    } catch (err) {
        await trx.rollback();
        console.error(err);
        response.status(400).json({ error: 'Unexpected error while creating new user'});
    };
}