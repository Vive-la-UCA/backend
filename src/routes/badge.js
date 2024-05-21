const { Router } = require('express')
const {
  badgeGet,
  badgePost,
  badgeGetOne,
  badgePut,
  badgeDelete
} = require('../controllers/badge')
const { validateJWT, validateFields, isAdminRole } = require('../middlewares')
const { check } = require('express-validator')
const { badgeExistsById, routeExists } = require('../helpers')
const { upload } = require('../middlewares/multer-file')
fs = require('fs')

const router = Router()

// Get All Badges
router.get('/', [validateJWT, validateFields], badgeGet)

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

// Create Badge
router.post(
  '/',
  [
    validateJWT,
    upload.single('image'),
    check('name', 'name is required').not().isEmpty(),
    check('route', 'Invalid route').isMongoId(),
    check('route').custom(routeExists),
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
    upload.single('image'),
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
