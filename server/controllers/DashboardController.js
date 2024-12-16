import {
    countAllInfo as countAllInfoService,
} from "../service/DashboardService.js"
import { CreateResponse } from "../utils/CreateResponse.js"

export const countAllInfo = async (req,res,next) => {
    try {
        const response = await countAllInfoService(req)
        CreateResponse(res, response)
    } catch (error) {
        next(error)
    }
}

