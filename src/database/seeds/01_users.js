
export function seed(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'Joe da Quebrada', first_name: 'Joe',  last_name: 'da Quebrada', email: 'joe@quebrada.com', password: '123456'}
      ]);
    });
}
