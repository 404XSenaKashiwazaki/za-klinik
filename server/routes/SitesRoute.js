import express from "express"
import { destroy, find, removeLogo, restore, store, update } from "../controllers/SitesController.js"
import { validate } from "../validators/Validator.js"
import upload, { fileUploads } from "../middleware/ValidateUpload.js"
import {  rule } from "../validators/custom/SitesCustomValidator.js"
import { handleUpload } from "../middleware/handleupload/SitesHandleUpload.js"

const routes = express.Router()

routes.route("/sites")
.get(find)

routes.route("/sites/add")
.post(fileUploads("site","logo","./public/sites/").any(),validate(rule),handleUpload,store)
routes.route("/sites/update/:id")
.put(fileUploads("site","logo","./public/sites/").any(),validate(rule),handleUpload,update)

routes.route("/sites/destroy/:id")
.delete(destroy)

routes.route("/sites/restore/:id")
.put(restore)

routes.route("/sites/:id/remove-logo")
.delete(fileUploads("site","logo","./public/sites/").any(),removeLogo)

export default routes