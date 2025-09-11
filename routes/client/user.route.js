const express = require('express')
const route = express.Router()
const controller = require('../../controllers/client/user.controller')
const validate = require('../../validates/client/user.validate')

route.get('/register',controller.register)

route.post('/register',
    validate.save,
    controller.save
)

route.get('/login',controller.login)

route.post('/login',
    validate.save,
    controller.postLogin
)

route.get('/logout', controller.logout)

module.exports = route