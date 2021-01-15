
exports.up = function (knex) {
  return knex.schema.createTable('operation', (table) => {
    table.increments();
    table.string('status').notNullable();
    table.integer('imageId').notNullable();
    table.bigInteger('createdAt').notNullable();
    table.bigInteger('updatedAt').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('operation');
};
