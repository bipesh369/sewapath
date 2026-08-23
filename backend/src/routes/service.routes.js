import { Router } from "express"
import getServices from "../controllers/service.controller.js"



const router = Router()

router.route("/").get(getServices)


export default router