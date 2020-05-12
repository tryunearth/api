exports.up = function (knex) {
  return knex.schema.table('user', (table) => {
    table.boolean('has_completed_onboarding').notNullable().default(false)
    table
      .bigInteger('last_sync_time')
      .notNullable()
      .default(knex.raw('TRUNC(EXTRACT(EPOCH from NOW()))'))

    knex('user').update('has_completed_onboarding', knex.raw('DEFAULT'))
    knex('user').update('last_sync_time', knex.raw('DEFAULT'))
  })
}

exports.down = function (knex) {
  return knex.schema.table('user', (table) => {
    table.dropColumn('last_sync_time')
    table.dropColumn('has_completed_onboarding')
  })
}
