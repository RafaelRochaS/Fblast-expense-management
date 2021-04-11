
exports.up = function(knex) {
    return knex.schema.createTable('income', table => {
        table.increments('id').primary();
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.decimal('value').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('income');
};
