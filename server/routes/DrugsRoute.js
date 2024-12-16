import express from "express"
import { destroy, findAll, findOne, restore, store, update } from "../controllers/DrugsController.js"
import { validate } from "../validators/Validator.js"
import upload, { fileUploads } from "../middleware/ValidateUpload.js"
import { rule, validateDuplicate, validateUpdate } from "../validators/custom/DrugsCustomValidator.js"
import { VerifyToken } from "../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/drugs")
.get(VerifyToken,findAll)

routes.route("/drugs/:id")
.get(VerifyToken,findOne)

routes.route("/drugs/add")
.post(fileUploads("drugs","","").any(),validate(rule),validateDuplicate,store)
routes.route("/drugs/update")
.put(VerifyToken,fileUploads("drugs","","").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/drugs/destroy")
.delete(VerifyToken,destroy)

routes.route("/drugs/restore")
.put(VerifyToken,restore)

export default routes