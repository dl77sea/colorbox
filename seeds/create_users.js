const usersList = [
  {
    id: 1,
    first_name: 'Alfred',
    last_name: 'Prufrock',
    email: 'ajp@lovesong.com',
    hashed_password: '$2a$12$rPCLzGBfiFnoTMwgvC0A/e259BWuYVXhtfSn/MmjTrNc1C0ENGw1K',  //theydonotsing
    created_at: new Date('2017-08-01 14:26:16 UTC'),
    updated_at: new Date('2017-08-01 14:26:16 UTC')
  },
  {
    id: 2,
    first_name: 'Samuel',
    last_name: 'Beckett',
    email: 'waiting@godot.com',
    hashed_password: '$2a$12$oEnJjrb2XsPOTGhrn0o21.Ck5qiOXF4OIXes1rjCrbQJlRlSwoTVW',// failbetter
    created_at: new Date('2017-08-02 14:26:16 UTC'),
    updated_at: new Date('2017-08-02 14:26:16 UTC')
  },
  {
    id: 3,
    first_name: 'Snarf',
    last_name: 'Bert',
    email: 'snarf@snarf.com',
    hashed_password: '$2a$12$oEnJjrb2XsPOTGhrn0o21.Ck5qiOXF4OIXes1rjCrbQJlRlSwoTVW',// failbetter
    created_at: new Date('2017-08-02 14:26:16 UTC'),
    updated_at: new Date('2017-08-02 14:26:16 UTC')
  }
]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(
        usersList
      );
    })
    .then(() => {
      //?
    return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));")
    });
};
