
exports.up = function(knex) {
    return knex.schema.createTable('expenses', table => {
        table.increments('id').primary();
        table.integer('userId')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.string('item').notNullable();
        table.decimal('value').notNullable();
        table.timestamp('dateDue').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('expenses');
};
