const express = require('express')
const route = express.Router()
const controller = require('../../controllers/admin/setting.controller')
const multer  = require('multer')
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

route.get('/general', controller.general)
route.patch('/general', 
    upload.single('logo'),
    uploadCloud.upload,
    controller.generalPatch
)

module.exports = route
