const express = require("express")
const router = express.Router()
const authenticateUser = require("../middleware/authentication")

const {
  login,
  register,
  forgotPassword,
  resetPassword,
  getUserInfo,
  addAddress,

} = require("../controllers/user")
const activateStream = require("../middleware/activateStream")

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/forgot_password").post(forgotPassword)
router.route("/reset_password/:id/:token").post(resetPassword)
router.route("/user/info").get(authenticateUser,activateStream, getUserInfo)
router.route("/user/addAddress").post(authenticateUser,activateStream, addAddress)


module.exports = router
