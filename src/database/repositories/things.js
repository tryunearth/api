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

const batchCreateThing = async (userId, data) => {
  let things = []

  if (Array.isArray(data)) {
    things = [...data]
  } else {
    things.push(data)
  }

  await db('thing').insert(
    things.map((thing) => {
      const isUrl = new RegExp(/htt(p|ps):\/\//)
      const isComment = new RegExp(/^t1_\w+/)
      const hasPreviewImage =
        thing.thumbnail && thing.thumbnail !== 'self' ? true : false

      return {
        id: thing.id,
        subreddit: thing.subreddit.display_name,
        selftext: thing.selftext,
        author_fullname: thing.author_fullname,
        title: isComment.test(thing.name) ? thing.link_title : thing.title,
        subreddit_name_prefixed: thing.subreddit_name_prefixed,
        name: isComment.test(thing.name) ? 'comment' : 'post',
        category: thing.category,
        score: thing.score,
        thumbnail: hasPreviewImage
          ? thing.preview && isUrl.test(thing.preview.images[0].source.url)
            ? thing.preview.images[0].source.url
            : thing.thumbnail
          : null,
        over_18: thing.over_18,
        author: thing.author.name,
        permalink: thing.permalink,
        url: thing.url,
        created_utc: thing.created_utc,
        surfaced: false,
        user_id: userId,
      }
    }),
  )
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
  batchCreateThing,
  browseThings,
  updateThing,
  removeThing,
}
