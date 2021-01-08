
exports.up = function(knex) {
  return knex.schema.createTable('image', (table) => {
    table.increments();
    table.string('path').notNullable();
    table.string('name').notNullable();
    table.integer('uploader').notNullable();
    table.bigInteger('createdAt').notNullable();
    table.bigInteger('updatedAt').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('image');
};
