const router = require('express').Router()
const { auth, tags, things } = require('../controllers')

/**
 * Auth
 */
router.post('/auth/login', auth.fetchAccessToken)

router.get('/auth/me', auth.getUser)
router.put('/auth/me', auth.updateUser)
router.delete('/auth/me', auth.deleteUser)

/**
 * Tags
 */
router.get('/tags', tags.getTags)
router.get('/tags/:id', tags.getTag)
router.post('/tags', tags.createTag)
router.delete('/tags/:id', tags.deleteTag)

/**
 * Things
 */
router.get('/things', things.getThings)
router.post('/things', things.createThing)
router.put('/things/:id', things.updateThing)
router.delete('/things/:id', things.deleteThing)

module.exports = router
