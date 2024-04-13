const { Router } = require('express')
const { search } = require('../controllers/search')
const { validateJWT, validateFields } = require('../middlewares')

const router = Router()

router.get('/:collection/:term', [validateJWT, validateFields], search)

module.exports = router
