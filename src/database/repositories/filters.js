const db = require('../config')

const browseSubreddits = async (userId) => {
  return await db
    .select('subreddit_name_prefixed as name')
    .from('thing')
    .where({ user_id: userId })
    .distinct()
}

const browseTags = async (userId) => {
  return await db
    .select('id', 'name')
    .from('tag')
    .where({ user_id: userId })
    .distinct()
}

module.exports = { browseSubreddits, browseTags }
