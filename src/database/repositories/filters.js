const db = require('../config')

const alphanumericSort = (a, b) =>
  a.name.toLowerCase() <= b.name.toLowerCase() ? -1 : 1

const browseSubreddits = async (userId) => {
  return (
    await db
      .select('subreddit_name_prefixed as name')
      .from('thing')
      .where({ user_id: userId })
      .distinct()
  ).sort(alphanumericSort)
}

const browseTags = async (userId) => {
  return (
    await db
      .select('id', 'name')
      .from('tag')
      .where({ user_id: userId })
      .distinct()
  ).sort(alphanumericSort)
}

module.exports = { browseSubreddits, browseTags }
