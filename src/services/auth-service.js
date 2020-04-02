const db = require('../database/config')

const readUser = async userId => {
  return await db('user')
    .columns(
      process.env.NODE_ENV === 'production'
        ? ['id', 'username', 'email', 'frequency']
        : '*',
    )
    .where({ id: userId })
    .first()
}

const createUser = async data => {}

const updateUser = async (userId, updates) => {
  await db('user')
    .where({ id: userId })
    .update(updates)
}

const removeUser = async userId => {
  await db('user')
    .where({ id: userId })
    .delete()
}

module.exports = {
  readUser,
  updateUser,
  removeUser,
}
