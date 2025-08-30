const express = require('express')
const route = express.Router()
const controller = require('../../controllers/admin/product-category.controller')
const validate = require("../../validates/product-category.validate")
const multer  = require('multer')
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")


route.get('/', controller.index)

route.get("/create",controller.create)

route.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.save,
    controller.save
)


route.get("/edit/:id",controller.edit)

route.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.update,
    controller.update
)

module.exports = route