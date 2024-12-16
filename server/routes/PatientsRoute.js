import express from "express"
import { destroy, findAll, findOne, restore, store, update } from "../controllers/PatientsController.js"
import { validate } from "../validators/Validator.js"
import upload, { fileUploads } from "../middleware/ValidateUpload.js"
import { rule, validateDuplicate, validateUpdate } from "../validators/custom/PatientsCustomValidator.js"
import { VerifyToken } from "../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/patients")
.get(VerifyToken,findAll)

routes.route("/patients/:id")
.get(VerifyToken,findOne)

routes.route("/patients/add")
.post(VerifyToken,fileUploads("patients","patients","").any(),validate(rule),validateDuplicate,store)
routes.route("/patients/update")
.put(VerifyToken,fileUploads("patients","patients","").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/patients/destroy")
.delete(VerifyToken,destroy)

routes.route("/patients/restore")
.put(VerifyToken,restore)

export default routes