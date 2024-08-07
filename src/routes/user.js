const { Router } = require('express')
const {
  usersPost,
  usersGet,
  usersGetOne,
  usersGetNoPagination,
  addBadgeToUser,
  userAdminSeed,
  usersDelete
} = require('../controllers/user')
const { check } = require('express-validator')
const { emailExists, userExistsById, badgeExistsById } = require('../helpers')
const { validateFields, validateJWT, isAdminRole } = require('../middlewares')

const router = Router()

// Get All Users
router.get('/', [validateJWT, validateFields], usersGet)

// Get All Users without pagination
router.get('/all', [validateJWT, validateFields], usersGetNoPagination)

// Get One User
router.get(
  '/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    validateJWT,
    validateFields
  ],
  usersGetOne
)

// Create User
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('email').custom(emailExists),
    check(
      'password',
      'Password is required and greater than 8 digits'
    ).isLength({ min: 8 }),
    isAdminRole,
    validateFields
  ],
  usersPost
)

// Admin Seed
router.get('/run/seed', userAdminSeed)

// Add Badge to User
router.put(
  '/add-badge/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    check('badge', 'Invalid id').isMongoId(),
    check('badge').custom(badgeExistsById),
    validateJWT,
    validateFields
  ],
  addBadgeToUser
)

// Delete User
router.delete(
  '/:id',
  [
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    isAdminRole,
    validateFields
  ],
  usersDelete
)

module.exports = router
