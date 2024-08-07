const { Router } = require('express')
const { check } = require('express-validator')
const { login, loginGoogle, checkToken } = require('../controllers/auth')
const {
  validateFields,
  checkBearerToken,
  validateJWT
} = require('../middlewares')
const { usersPost } = require('../controllers/user')
const { emailExists } = require('../helpers')

const router = Router()

// Login endpoint
router.post(
  '/login',
  [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
  ],
  login
)

// Register endpoint
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('email').custom(emailExists),
    check('password', 'Password is required').not().isEmpty(),
    check(
      'password',
      'Password is required and greater than 8 digits'
    ).isLength({ min: 8 }),
    validateFields
  ],
  usersPost
)

// Google login endpoint
router.post('/google', [checkBearerToken, validateFields], loginGoogle)

// Check token endpoint
router.get('/check-token', [validateJWT, validateFields], checkToken)

module.exports = router
