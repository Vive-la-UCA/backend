const { Router } = require('express')
const { profileGet } = require('../controllers/profile')

const router = Router()

router.get('/', profileGet)
