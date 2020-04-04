const db = require('../config')

const readTagById = async (userId, id) => {
  return await db('tag')
    .where({ id, user_id: userId })
    .first()
}

const browseTags = async userId => {
  return await db('tag').where({ user_id: userId })
}

const createTag = async (userId, name) => {
  const [id] = await db('tag')
    .insert({ name, user_id: userId })
    .returning('id')
  return await readTagById(userId, id)
}

const removeTag = async (userId, id) => {
  const numRowsDeleted = await db('tag')
    .where({ id, user_id: userId })
    .delete()
  const wasDeleted = numRowsDeleted === 0 ? false : true
  return wasDeleted
}

module.exports = {
  createTag,
  browseTags,
  readTagById,
  removeTag,
}
