const { Router } = require('express')
const {
  badgeGet,
  badgePost,
  badgeGetOne,
  badgeGetOneByRoute,
  badgePut,
  badgeDelete,
  badgeGetAll
} = require('../controllers/badge')
const { validateJWT, validateFields, isAdminRole } = require('../middlewares')
const { check } = require('express-validator')
const {
  badgeExistsById,
  routeExists,
  badgeWithRouteExists,
  routeExistsById
} = require('../helpers')
const { upload } = require('../middlewares/multer-file')
fs = require('fs')

const router = Router()

// Get All Badges
router.get('/', [validateJWT, validateFields], badgeGet)

// Get All Badges No Pagination
router.get('/all', [validateJWT, validateFields], badgeGetAll)

// Get One Badge
router.get(
  '/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(badgeExistsById),
    validateJWT,
    validateFields
  ],
  badgeGetOne
)

// Get One Badge By Route
router.get(
  '/route/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(routeExistsById),
    validateJWT,
    validateFields
  ],
  badgeGetOneByRoute
)

// Create Badge
router.post(
  '/',
  [
    validateJWT,
    upload.single('image'), // multer middleware to upload file
    check('name', 'name is required').not().isEmpty(),
    check('route', 'Invalid route').isMongoId(),
    check('route').custom(badgeWithRouteExists),
    isAdminRole,
    validateFields
  ],
  badgePost
)

// Update Badge
router.put(
  '/:id',
  [
    validateJWT,
    upload.single('image'), // multer middleware to upload file
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(badgeExistsById),
    isAdminRole,
    validateFields
  ],
  badgePut
)

router.delete(
  '/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(badgeExistsById),
    validateJWT,
    isAdminRole,
    validateFields
  ],
  badgeDelete
)

module.exports = router
