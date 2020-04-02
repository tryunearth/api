const router = require('express').Router()
const { auth, healthCheck, tags, things } = require('../controllers')

/**
 * Health Check
 */
router.get('/status', healthCheck.getStatus)

/**
 * Auth
 */
// router.post('/auth/login', auth.oauthDance)

router.get('/auth/me', auth.getUser)
router.patch('/auth/me', auth.patchUser)
router.delete('/auth/me', auth.deleteUser)

/**
 * Tags
 */
router.get('/tags', tags.getTags)
router.get('/tags/:id', tags.getTag)
router.post('/tags', tags.postTag)
router.delete('/tags/:id', tags.deleteTag)

/**
 * Things
 */
router.get('/things', things.getThings)
router.post('/things', things.postThing)
router.patch('/things/:id', things.patchThing)
router.delete('/things/:id', things.deleteThing)

module.exports = router
