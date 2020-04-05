exports.seed = function(knex) {
  return knex('thing_tag').insert([
    { tag_id: 1, thing_id: 'eh2xu5' },
    { tag_id: 2, thing_id: 'eh2xu5' },
    { tag_id: 3, thing_id: 'ffve1h' },
    { tag_id: 4, thing_id: 'ffve1h' },
    { tag_id: 5, thing_id: 'fur149' },
    { tag_id: 6, thing_id: 'fur149' },
    { tag_id: 7, thing_id: 'eubyfg' },
    { tag_id: 8, thing_id: 'eubyfg' },
  ])
}
