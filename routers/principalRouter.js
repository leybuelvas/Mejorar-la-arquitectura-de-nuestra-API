const express = require('express')
const routerRandom = require('./routers/random')
const routerProductos = require('./routers/productos')
const routerLogeo = require('./routers/logeo')
const router = express.Router()



router.use('/api', routerRandom)
router.use('/api/productos-test', routerProductos)
router.use('/logeo', routerLogeo)

module.exports = router