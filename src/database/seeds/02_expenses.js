
export function seed(knex) {
  // Deletes ALL existing entries
  return knex('expenses').del()
    .then(function () {
      // Inserts seed entries
      return knex('expenses').insert([
        {id: 1, user_id: 1, item: 'Electric', value: 70, date_due: new Date(2021, 5, 1)},
        {id: 2, user_id: 1, item: 'Gas', value: 60, date_due: new Date(2021, 5, 8)},
        {id: 3, user_id: 1, item: 'Food', value: 650.8, date_due: new Date(2021, 4, 28)},
        {id: 4, user_id: 1, item: 'Beer', value: 950.7, date_due: new Date(2021, 4, 23)}
      ]);
    });
}
