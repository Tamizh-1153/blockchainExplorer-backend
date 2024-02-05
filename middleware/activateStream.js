require("dotenv").config()
const Moralis = require("moralis").default

const activateStream = async (req, res, next) => {
  try {
    await Moralis.Streams.updateStatus({
      id: `${process.env.Stream_ID}`,
      status: "active",
    })
    console.log("Stream activated")
    next()
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = activateStream
