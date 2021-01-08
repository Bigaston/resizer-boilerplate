
exports.up = function(knex) {
  return knex.schema.createTable('user', (table) => {
    table.increments();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.bigInteger('createdAt').notNullable();
    table.bigInteger('updatedAt').notNullable();
  });
};

exports.down = function(knex) {
  knex.schema.dropTable('user');
};
