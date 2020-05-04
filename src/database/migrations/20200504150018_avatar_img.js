exports.up = function (knex) {
  return knex.schema.table('user', (table) => {
    table.string('avatar_img')
  })
}

exports.down = function (knex) {
  return knex.schema.table('user', (table) => {
    table.dropColumn('avatar_img')
  })
}
