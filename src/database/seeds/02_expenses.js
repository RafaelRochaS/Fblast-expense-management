
export async function seed(knex) {

  let default_id;

  await knex('users')
    .select('id')
    .where({ username: 'Joe da Quebrada' })
    .then(data => {
      default_id = data[0].id;
    });

  // Deletes ALL existing entries
  return knex('expenses').del()
    .then(function () {
      // Inserts seed entries
      return knex('expenses').insert([
        { user_id: default_id, item: 'Electric', value: 70, date_due: new Date(2021, 5, 1) },
        { user_id: default_id, item: 'Gas', value: 60, date_due: new Date(2021, 5, 8) },
        { user_id: default_id, item: 'Food', value: 650.8, date_due: new Date(2021, 4, 28) },
        { user_id: default_id, item: 'Beer', value: 950.7, date_due: new Date(2021, 4, 23) }
      ]);
    });
}
