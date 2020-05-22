const snoowrap = require('snoowrap')
const differenceWith = require('lodash.differencewith')
const db = require('../../database/config')
const AuthRepo = require('./auth')
const ThingRepo = require('./things')

const fetchAllSaves = async (user, options = { initialSync: false }) => {
  const r = new snoowrap({
    refreshToken: user.refresh_token,
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
  })

  const saves = await r
    .getUser(user.username)
    .getSavedContent()
    .fetchAll({ skipReplies: true })

  await AuthRepo.updateUser(user.id, { last_sync_time: db.raw('DEFAULT') })

  if (options.initialSync) {
    await ThingRepo.batchCreateThing(user.id, saves)
    await AuthRepo.updateUser(user.id, { has_completed_onboarding: true })
  } else {
    const currentSaves = await db
      .select('id')
      .from('thing')
      .where({ user_id: user.id })

    const comparator = (arrVal, othVal) => arrVal.id === othVal.id

    const removed = differenceWith(currentSaves, saves, comparator)
    const added = differenceWith(saves, currentSaves, comparator)

    await db('thing')
      .where({ user_id: user.id })
      .whereIn(
        'id',
        removed.map((thing) => thing.id),
      )
      .delete()

    await ThingRepo.batchCreateThing(user.id, added)
    return { removed: removed.length, added: added.length }
  }
}

const unsaveThing = async (user, thingId) => {
  const r = new snoowrap({
    refreshToken: user.refresh_token,
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
  })
  await r.getSubmission(thingId).unsave()
}

module.exports = { fetchAllSaves, unsaveThing }
