const express = require('express')
const router = new express.Router()
const sisLogeo = require('./controladores/controladorLogeo')

router.get('/info', sisLogeo.info)

router.get('/login', sisLogeo.login)

router.get('/registrar', sisLogeo.registrar)

router.post('/register', sisLogeo.registrarPost)

router.post('/login', sisLogeo.loginPost)

router.get('/login-error', sisLogeo.loginError)

router.get('/datos', sisLogeo.datos)

router.get('/logout', sisLogeo.logout)


router.use(express.static('./public'))

router.get('/todo', sisLogeo.todo)

router.get('/', sisLogeo.index);


module.exports = router