
exports.up = function(knex, Promise) {
  return knex.schema.createTable('boxes', (table) => {
    table.increments();
    // table.string('color').notNullable();
    table.float('width').notNullable();
    table.float('height').notNullable();
    table.float('depth').notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('boxes')
};
