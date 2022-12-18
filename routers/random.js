const express = require('express')
const router = express.Router()
const random = require('../controladores/controladorRandom')

router.get('/randoms', random.getRandom)

module.exports = router