import db from '../database/connection.js';

export async function index(request, response) {

    let users;

    try {
        await db('users')
            .select('*')
            .then(data => {
                users = data;
            });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
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
        response.status(400).json({ error: 'Unexpected error while creating new user' });
    };
}

export async function update(request, response) {

    let exists = await checkIdExists(request.params.id)

    if (!exists) {
        return response.status(400).json({ error: 'UserId not found' });
    }

    const {
        username,
        first_name,
        last_name,
        email,
    } = request.body;

    const trx = await db.transaction();

    try {

        await trx('users')
            .where({ id: request.params.id })
            .update({
                username: username,
                first_name: first_name,
                last_name: last_name,
                email: email,
                updated_at: db.fn.now()
            });

        await trx.commit();

        response.status(200).json({ update: 'sucessful' });

    } catch (err) {
        await trx.rollback();
        console.error(err);
        response.status(400).json({ error: 'Unexpected error while updating user' });
    };

}

export async function remove(request, response) {

    const trx = await db.transaction();

    try {

        await trx('users')
            .where({ id: request.params.id })
            .del();

        await trx.commit();

        response.status(200).json({ remove: 'sucessful' });

    } catch (err) {
        await trx.rollback();
        console.error(err);
        response.status(400).json({ error: 'Unexpected error while deleting user' });
    };
}


async function checkIdExists(id) {

    let hasId;
    let exists = false;
    let numId = parseInt(id);

    await db('users')
        .select('id')
        .then(data => hasId = data);


    for (let index = 0; index < hasId.length; index++) {
        if (hasId[index].id === numId) {
            exists = true;
            break;
        }
    }

    return exists;
}