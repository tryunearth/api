exports.seed = function(knex) {
  return knex('tag').insert([
    { id: 1, name: 'homework', user_id: 'xmeax' },
    { id: 2, name: 'programming', user_id: 'xmeax' },
    { id: 3, name: 'business', user_id: 'xmeax' },
    { id: 4, name: 'social media', user_id: 'xmeax' },
    { id: 5, name: 'finance', user_id: 'a9cqu' },
    { id: 6, name: 'work', user_id: 'a9cqu' },
    { id: 7, name: 'funny', user_id: 'a9cqu' },
    { id: 8, name: 'reading list', user_id: 'a9cqu' },
  ])
}
