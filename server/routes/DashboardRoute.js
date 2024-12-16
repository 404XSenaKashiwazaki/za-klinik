import express from "express"
import { countAllInfo } from "../controllers/DashboardController.js"

import { VerifyToken } from "../middleware/VerifyToken.js"

const routes = express.Router()

routes.route("/dashboards")
.get(countAllInfo)


export default routes