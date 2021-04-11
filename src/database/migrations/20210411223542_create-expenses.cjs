
exports.up = function(knex) {
    return knex.schema.createTable('expenses', table => {
        table.increments('id').primary();
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.string('item').notNullable();
        table.decimal('value').notNullable();
        table.timestamp('date_due').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('expenses');
};
