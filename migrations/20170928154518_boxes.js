
exports.up = function(knex, Promise) {
  return knex.schema.createTable('boxes', (table) => {
    table.increments();
    // table.string('color').notNullable();
    table.float('width').notNullable();
    table.float('height').notNullable();
    table.float('depth').notNullable();

    // table.string('username')
    //   .references('email')
    //   .inTable('users')
    //   .onDelete('CASCADE');

    /* will doing this require:

        http call each time from genBox in post component?

        or should i add username in here?

        or use an extra http get call and an innerjoin to return
        an object here with box desc and username?
        (nothing should return from here
        ..but to avoid extra http call upon htttp-get of this table
        during post... should probably populate username here now)
        -using cookie id to do that.. but isn't that exposed to
         front end? so then why not just store userid in cookie
         instead of or in addition to id number? and if not
         front exposed, then why not just store username directly in
         cookie anyway? why the intermediary id step?
    */

    //is this wrong?
    // table.string('username')

    //why is this needed at all (we get user id from claim, right?)
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('boxes')
};
