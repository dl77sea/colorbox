
exports.up = function(knex, Promise) {
  return knex.schema.createTable('boxes', (table) => {
    table.increments();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('boxes')
};
