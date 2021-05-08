
export function seed(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'JoedaQuebrada', firstName: 'Joe',  lastName: 'da Quebrada', income: 5000, email: 'joe@quebrada.com', password: '123456'}
      ]);
    });
}
