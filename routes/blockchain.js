const express = require("express")
const router = express.Router()
const { getWalletDetails, getTransactionByHash } = require("../controllers/blockchain")


router.route("/address/:id").get(getWalletDetails)
router.route("/hash/:id").get(getTransactionByHash)



module.exports =router