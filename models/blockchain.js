const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  nativeBal: {
    type: Number,
  },
  ethValue: {
    type: Number,
  },
  ERC20TokenBalance: {
    type: String,
  },
  transactions: {
    type: [Object],
  },
})

module.exports = mongoose.model('Address', addressSchema)