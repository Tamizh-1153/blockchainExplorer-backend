const User = require("../models/user")

// const Moralis = require("moralis").default


const liveTransactions = async(req,res) => {
const { body } = req

try {
  console.log(body)
  if (body.txs.length > 0) {
    const user = await User.findOne({ address: body.txs[0].toAddress })

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })

    var mailOptions = {
      from: "youremail@gmail.com",
      to: user?.email,
      subject: "Password reset ",
      text: `New transaction received
        From : ${body.txs[0].fromAddress},
        Hash : ${body.txs[0].hash},
        Block Number : ${block.number},
        Time : ${block.timestamp},
        `,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent: " + info.response)
      }
    })

    return res.json({ message: "Transaction mail sent successfully" })
  }

} catch (error) {
  res.json(error.message)
}
return res.json(body)
}

module.exports = liveTransactions