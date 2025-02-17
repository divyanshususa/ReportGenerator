import { Router } from "express";
import { deleteReport, deleteUser, denyAcsess, getALLReports, getAUser, getAllUsers, getFilteredReport, grantAcsess, login, protectedExcel, register, resetPassword, setExcelPassword, setPasswordAndLevel } from "../controllers/user.controller.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)

router.route("/login").post(login)
router.route("/set-excel-password").post(setExcelPassword)


router.route("/set-password-level").post(isAuthenticated, authorizedAdmin, setPasswordAndLevel)

router.route("/get-a-user/:id").get(isAuthenticated, authorizedAdmin, getAUser)

router.route("/delete-a-user/:id").delete(isAuthenticated, authorizedAdmin, deleteUser)

router.route("/get-users").get(isAuthenticated, authorizedAdmin, getAllUsers)



router.route("/get-reports/:id").get(isAuthenticated, getALLReports)
router.route("/delete-reports/:id").delete(isAuthenticated, deleteReport)

router.route("/get-filtered-reports/:id").post(isAuthenticated, getFilteredReport)

// router.route("/get-todays-reports/:id").get(isAuthenticated, getTodaysReport)

router.route("/get-protected-reports/:id").post(isAuthenticated, protectedExcel)

router.route("/get-admin-reports/:id").get(isAuthenticated, authorizedAdmin, getALLReports)

router.route("/deny-access").post(isAuthenticated, authorizedAdmin, denyAcsess)

router.route("/grant-access").post(isAuthenticated, authorizedAdmin, grantAcsess)

router.route("/reset-password").post(isAuthenticated, authorizedAdmin, resetPassword)

export default router