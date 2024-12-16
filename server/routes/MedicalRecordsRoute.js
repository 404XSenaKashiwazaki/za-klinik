import express from "express"
import { destroy, findAll, findOne, restore, store, update } from "../controllers/MedicalRecordsController.js"
import { validate } from "../validators/Validator.js"
import upload, { fileUploads } from "../middleware/ValidateUpload.js"
import { rule, validateDuplicate, validateUpdate } from "../validators/custom/MedicalRecordsCustomValidator.js"
import { VerifyToken } from "../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/medical-records")
.get(VerifyToken,findAll)

routes.route("/medical-records/:id")
.get(VerifyToken,findOne)

routes.route("/medical-records/add")
.post(fileUploads("medicalRecords","medicalRecords","").any(),validate(rule),validateDuplicate,store)
routes.route("/medical-records/update")
.put(VerifyToken,fileUploads("medicalRecords","medicalRecords","").any(),validate(rule),validateDuplicate,validateUpdate,update)

routes.route("/medical-records/destroy")
.delete(VerifyToken,destroy)

routes.route("/medical-records/restore")
.put(VerifyToken,restore)

export default routes