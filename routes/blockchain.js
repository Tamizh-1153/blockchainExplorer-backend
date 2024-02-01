const express = require("express")
const router = express.Router()
const { getWalletDetails, getTransactionByHash, liveTransaction } = require("../controllers/blockchain")


router.route("/address/:id").get(getWalletDetails)
router.route("/hash/:id").get(getTransactionByHash)
router.route('/webhook').post(liveTransaction)


module.exports =router