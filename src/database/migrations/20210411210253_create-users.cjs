
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
