const express = require('express')
const route = express.Router()
const controller = require('../../controllers/admin/product.controller')
const validate = require("../../validates/product.validate")

const multer  = require('multer')
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() })

route.get('/', controller.index)

route.patch("/change-status/:status/:id", controller.changeStatus)

route.patch("/change-multi", controller.changeMulti)

route.delete("/delete/:id", controller.delete)

route.get("/create", controller.create)

route.post("/create",
    upload.single('thumbnail'),
    validate.save,
    controller.save
)

route.get('/edit/:id', controller.edit)

route.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    validate.update,
    controller.update

)

route.get('/detail/:id', controller.detail)

module.exports = route