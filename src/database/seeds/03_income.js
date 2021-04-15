
export function seed(knex) {
  // Deletes ALL existing entries
  return knex('income').del()
    .then(function () {
      // Inserts seed entries
      return knex('income').insert([
        {id: 1, user_id: 1, value: 5000},
      ]);
    });
}
