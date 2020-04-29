const snoowrap = require('snoowrap')

const db = require('../../database/config')

const fetchAllSaves = async (user) => {
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

  await db('thing').insert(
    saves.map((save) => {
      const isUrl = new RegExp(/htt(p|ps):\/\//)
      const isComment = new RegExp(/^t1_\w+/)
      const hasPreviewImage =
        save.thumbnail && save.thumbnail !== 'self' ? true : false

      return {
        id: save.id,
        subreddit: save.subreddit.display_name,
        selftext: save.selftext,
        author_fullname: save.author_fullname,
        title: isComment.test(save.name) ? save.link_title : save.title,
        subreddit_name_prefixed: save.subreddit_name_prefixed,
        name: isComment.test(save.name) ? 'comment' : 'post',
        category: save.category,
        score: save.score,
        thumbnail: hasPreviewImage
          ? save.preview && isUrl.test(save.preview.images[0].source.url)
            ? save.preview.images[0].source.url
            : save.thumbnail
          : null,
        over_18: save.over_18,
        author: save.author.name,
        permalink: save.permalink,
        url: save.url,
        created_utc: save.created_utc,
        surfaced: false,
        user_id: user.id,
      }
    }),
  )
}

module.exports = { fetchAllSaves }
