const express = require("express")
const router = express.Router()

const activateStream = require("../middleware/activateStream")
const liveTransactions = require("../controllers/webhook")


router.route('/webhook').post(liveTransactions)



module.exports = router