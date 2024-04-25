import { Router } from "express";
import { getAReport, telecomAdminUpdate, telecomInsertion, telecomUpdate } from "../controllers/telecom.controller.js";
import { authorizedAdmin, isAuthenticated, requireAccessLevel } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/telecom-report").post(isAuthenticated, requireAccessLevel("telecom"), telecomInsertion)

router.route("/get-a-report/:id").get(isAuthenticated, requireAccessLevel("telecom"), getAReport)

router.route("/get-admin-report/:id").get(isAuthenticated, authorizedAdmin, getAReport)

router.route("/update/telecom-report").put(isAuthenticated, requireAccessLevel("telecom"), telecomUpdate)

router.route("/admin-update/telecom-report").put(isAuthenticated, authorizedAdmin, telecomAdminUpdate)


export default router