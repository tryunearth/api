exports.seed = function(knex) {
  return knex('user').insert([
    {
      id: 'xmeax',
      username: 'Sexy_couch_potato',
      email: '',
      frequency: 'monthly',
      has_synced_with_reddit: true,
      sync_status: 'successful',
      refresh_token: 'xxxxx-xxxx-xxxxxxx',
    },
    {
      id: 'a9cqu',
      username: 'Cedricium',
      email: 'test@example.com',
      frequency: 'daily',
      has_synced_with_reddit: false,
      sync_status: 'not-started',
      refresh_token: 'xxxxx-xxxx-xxxxxxx',
    },
  ])
}
