const boxesList = [
  // {
  //   id: 3,
  //   first_name: 'Snarf',
  //   last_name: 'Bert',
  //   email: 'waiting@godot.com',
  //   hashed_password: '$2a$12$oEnJjrb2XsPOTGhrn0o21.Ck5qiOXF4OIXes1rjCrbQJlRlSwoTVW',// failbetter
  //   created_at: new Date('2017-08-02 14:26:16 UTC'),
  //   updated_at: new Date('2017-08-02 14:26:16 UTC')
  // }
  {
    width: 25,
    height: 25,
    depth: 25
  },
  {
    width: 25,
    height: 25,
    depth: 25
  },
  {
    width: 25,
    height: 25,
    depth: 25
  }
]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('boxes').del()
    .then(function () {
      // Inserts seed entries
      return knex('boxes').insert(
        boxesList
      );
    })
    .then(() => {
      //?
    return knex.raw("SELECT setval('boxes_id_seq', (SELECT MAX(id) FROM boxes));")
    });
};
