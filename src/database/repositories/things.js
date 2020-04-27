const db = require('../config')

const readThingById = async (userId, id) => {
  return await db('thing').where({ id, user_id: userId }).first()
}

const browseThings = async (userId, filters) => {
  if (filters.tag) {
    return await db
      .select('thing.*')
      .from('thing')
      .innerJoin('thing_tag', 'thing.id', 'thing_tag.thing_id')
      .innerJoin('tag', 'thing_tag.tag_id', 'tag.id')
      .where({ 'thing.user_id': userId, 'tag.name': filters.tag })
  }
  return await db('thing').where({ user_id: userId, ...filters })
}

const createThing = async (userId, data) => {
  const [id] = await db('thing')
    .insert({
      ...data,
      user_id: userId,
    })
    .returning('id')
  return await readThingById(userId, id)
}

const updateThing = async (userId, id, updates) => {
  const numRowsUpdated = await db('thing')
    .where({ id, user_id: userId })
    .update(updates)
  const wasUpdated = numRowsUpdated === 0 ? false : true
  return wasUpdated
}

const removeThing = async (userId, id) => {
  const numRowsDeleted = await db('thing')
    .where({ id, user_id: userId })
    .delete()
  const wasDeleted = numRowsDeleted === 0 ? false : true
  return wasDeleted
}

module.exports = {
  createThing,
  browseThings,
  updateThing,
  removeThing,
}
