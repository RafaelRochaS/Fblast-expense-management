
export async function seed(knex) {

  let defaultId;

  await knex('users')
    .select('id')
    .where({ username: 'Joe da Quebrada' })
    .then(data => {
      defaultId = data[0].id;
    });

  // Deletes ALL existing entries
  return knex('expenses').del()
    .then(function () {
      // Inserts seed entries
      return knex('expenses').insert([
        { userId: defaultId, item: 'Electric', value: 70, dateDue: new Date(2021, 5, 1) },
        { userId: defaultId, item: 'Gas', value: 60, dateDue: new Date(2021, 5, 8) },
        { userId: defaultId, item: 'Food', value: 650.8, dateDue: new Date(2021, 4, 28) },
        { userId: defaultId, item: 'Beer', value: 950.7, dateDue: new Date(2021, 4, 23) }
      ]);
    });
}
