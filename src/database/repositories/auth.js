const db = require('../config')

const readUser = async (userId) => {
  return await db('user')
    .columns(
      process.env.NODE_ENV === 'production'
        ? ['id', 'username', 'avatar_img']
        : '*',
    )
    .where({ id: userId })
    .first()
}

const createUser = async (data) => {
  await db('user')
    .insert(data)
    .returning(
      process.env.NODE_ENV === 'production'
        ? ['id', 'username', 'avatar_img']
        : '*',
    )
}

const updateUser = async (userId, updates) => {
  await db('user').where({ id: userId }).update(updates)
}

const removeUser = async (userId) => {
  await db('user').where({ id: userId }).delete()
}

module.exports = {
  readUser,
  createUser,
  updateUser,
  removeUser,
}
