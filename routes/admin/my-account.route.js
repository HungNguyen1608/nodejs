const express = require('express')
const route = express.Router()
const controller = require('../../controllers/admin/my-account.controller')
const multer  = require('multer')
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

route.get('/', controller.index)

route.get('/edit', controller.edit)

route.patch('/edit',
    upload.single('avartar'),
    uploadCloud.upload,
    controller.update
)

module.exports = route