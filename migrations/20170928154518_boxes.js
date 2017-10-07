
exports.up = function(knex, Promise) {
  return knex.schema.createTable('boxes', (table) => {
    table.increments();
    table.string('color').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('boxes')
};
