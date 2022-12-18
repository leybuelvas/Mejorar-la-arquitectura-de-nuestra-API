const express = require('express')
const router = express.Router()
const prod = require('../controladores/controladorProductos')


router.get('/', prod.sendProd)

module.exports = router
