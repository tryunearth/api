exports.up = function(knex) {
  return knex.schema
    .createTable('user', table => {
      table
        .string('id')
        .primary()
        .unique()
        .notNullable()
      table.string('username').notNullable()
      table.string('email').unique()
      table
        .enum('frequency', ['daily', 'weekly', 'monthly', 'unsubscribe'])
        .default('weekly')
        .notNullable()
      table
        .boolean('has_synced_with_reddit')
        .default(false)
        .notNullable()
      table
        .enum('sync_status', [
          'not-started',
          'in-progress',
          'successful',
          'failed',
        ])
        .default('not-started')
        .notNullable()
      table.string('refresh_token').notNullable()
    })
    .createTable('thing', table => {
      table.string('id').notNullable()
      table.string('subreddit')
      table.text('selftext')
      table.string('author_fullname')
      table.text('title')
      table.string('subreddit_name_prefixed')
      table.string('name')
      table.string('category')
      table.integer('score')
      table.text('thumbnail')
      table.boolean('over_18')
      table.string('author')
      table.string('permalink')
      table.text('url')
      table.bigInteger('created_utc')
      table.boolean('surfaced').default(false)
      table
        .string('user_id')
        .references('user.id')
        .notNullable()
        .onDelete('CASCADE')
      table.primary(['id', 'user_id'])
    })
    .createTable('tag', table => {
      table.increments('id').unique()
      table.string('name')
      table
        .string('user_id')
        .references('user.id')
        .notNullable()
        .onDelete('CASCADE')
    })
    .createTable('thing_tag', table => {
      table.string('thing_id').references(['thing.id', 'thing.user_id'])
      table
        .integer('tag_id')
        .references('tag.id')
        .notNullable()
        .onDelete('CASCADE')
      table.unique(['thing_id', 'tag_id'])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('thing_tag')
    .dropTableIfExists('tag')
    .dropTableIfExists('thing')
    .dropTableIfExists('user')
}
