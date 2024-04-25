import { Router } from "express";
import { authorizedAdmin, isAuthenticated, requireAccessLevel } from "../middlewares/auth.middleware.js";
import { getAReport, medicalAdminUpdate, medicalInsertion, medicalUpdate } from "../controllers/medical.controller.js";

const router = Router()

router.route("/medical-report").post(isAuthenticated, requireAccessLevel("medical"), medicalInsertion)
router.route("/get-a-report/:id").get(isAuthenticated, requireAccessLevel("medical"), getAReport)

router.route("/get-admin-report/:id").get(isAuthenticated, authorizedAdmin, getAReport)

router.route("/update/medical-report").put(isAuthenticated, requireAccessLevel("medical"), medicalUpdate)

router.route("/admin-update/medical-report").put(isAuthenticated, authorizedAdmin, medicalAdminUpdate)

export default router