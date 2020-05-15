const db = require('../config')

const readTagById = async (userId, id) => {
  return await db('tag').where({ id, user_id: userId }).first()
}

const readTagByName = async (userId, name) => {
  return await db('tag').where({ name: name, user_id: userId }).first()
}

const browseTags = async (userId) => {
  return await db('tag').where({ user_id: userId })
}

const createTag = async (userId, name, thingId = null) => {
  const [id] = await db('tag').insert({ name, user_id: userId }).returning('id')

  if (thingId) {
    await linkTagToThing(id, thingId)
  }

  return await readTagById(userId, id)
}

const removeTag = async (userId, id) => {
  const numRowsDeleted = await db('tag').where({ id, user_id: userId }).delete()
  const wasDeleted = numRowsDeleted === 0 ? false : true
  return wasDeleted
}

const browseLinkedTags = async (thingId) => {
  return await db('thing_tag').where({ thing_id: thingId })
}

const checkIfLinkedToThing = async (tagId, thingId) => {
  return await db('thing_tag')
    .where({ thing_id: thingId, tag_id: tagId })
    .first()
}

const linkTagToThing = async (tagId, thingId) => {
  return await db('thing_tag').insert({ thing_id: thingId, tag_id: tagId })
}

const unlinkTagFromThing = async (tagId, thingId) => {
  return await db('thing_tag')
    .where({ tag_id: tagId, thing_id: thingId })
    .delete()
}

const unlinkTagsFromThing = async (thingId) => {
  return await db('thing_tag').where({ thing_id: thingId }).delete()
}

module.exports = {
  createTag,
  browseTags,
  readTagById,
  readTagByName,
  removeTag,
  browseLinkedTags,
  checkIfLinkedToThing,
  linkTagToThing,
  unlinkTagFromThing,
  unlinkTagsFromThing,
}
