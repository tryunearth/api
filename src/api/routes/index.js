const router = require('express').Router()
const {
  AuthController,
  HealthCheckController,
  TagsController,
  ThingsController,
  FiltersController,
} = require('../controllers')
const { JWT } = require('../../core/jwt')
const asyncHandler = require('../helpers/async-handler')

/**
 * Health Check
 */
router.get('/status', HealthCheckController.getStatus)

/**
 * Auth
 */
router.post('/auth/login', asyncHandler(AuthController.oauthDance))

router.use('/auth/me', JWT.authorize)
router.get('/auth/me', asyncHandler(AuthController.getUser))
router.patch('/auth/me', asyncHandler(AuthController.patchUser))
router.delete('/auth/me', asyncHandler(AuthController.deleteUser))

/**
 * Tags
 */
router.use('/tags', JWT.authorize)
router.get('/tags', asyncHandler(TagsController.getTags))
router.get('/tags/:id', asyncHandler(TagsController.getTag))
router.post('/tags', asyncHandler(TagsController.postTag))
router.delete('/tags/:id', asyncHandler(TagsController.deleteTag))

/**
 * Things
 */
router.use('/things', JWT.authorize)
router.get('/things', asyncHandler(ThingsController.getThings))
router.post('/things', asyncHandler(ThingsController.postThing))
router.patch('/things/:id', asyncHandler(ThingsController.patchThing))
router.delete('/things/:id', asyncHandler(ThingsController.deleteThing))

/**
 * Filters
 */
router.use('/filters', JWT.authorize)
router.get('/filters', asyncHandler(FiltersController.getFilters))

/**
 * Reddit-specific
 */
router.use('/reddit', JWT.authorize)
router.get('/reddit/sync', asyncHandler(ThingsController.syncThings))

module.exports = router
