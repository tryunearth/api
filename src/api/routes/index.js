const router = require('express').Router()
const { auth, healthCheck, tags, things } = require('../controllers')
const asyncHandler = require('../helpers/async-handler')

/**
 * Health Check
 */
router.get('/status', healthCheck.getStatus)

/**
 * Auth
 */
// router.post('/auth/login', asyncHandler(auth.oauthDance))

router.get('/auth/me', asyncHandler(auth.getUser))
router.patch('/auth/me', asyncHandler(auth.patchUser))
router.delete('/auth/me', asyncHandler(auth.deleteUser))

/**
 * Tags
 */
// router.get('/tags', tags.getTags)
router.get('/tags', asyncHandler(tags.getTags))
router.get('/tags/:id', asyncHandler(tags.getTag))
router.post('/tags', asyncHandler(tags.postTag))
router.delete('/tags/:id', asyncHandler(tags.deleteTag))

/**
 * Things
 */
router.get('/things', asyncHandler(things.getThings))
router.post('/things', asyncHandler(things.postThing))
router.patch('/things/:id', asyncHandler(things.patchThing))
router.delete('/things/:id', asyncHandler(things.deleteThing))

module.exports = router
