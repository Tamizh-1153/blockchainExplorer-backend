const Moralis = require("moralis").default
const User = require("../models/user")
var nodemailer = require("nodemailer")
require("dotenv").config()

const register = async (req, res) => {
  const { email } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.json({ message: "User already exists" })
  }

  const user = await User.create({ ...req.body })
  console.log(user)
  res.json({ message: "Registered successfully", user: { name: user.name } })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.json({ message: "Please provide a valid email and password" })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.json({ message: "User not found" })
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    return res.json({ message: "Incorrect Password" })
  }

  const token = user.generateJWT()
  res.json({
    message: "Logged in successfully",
    user: { name: user.name },
    token,
  })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ message: "User not found" })
    }

    const token = user.generateJWT()
    await User.findOneAndUpdate({ email }, { token: token })
    const resetLink = `${process.env.FRONTEND_URL}/reset_password/${user._id}/${token}`

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })

    var mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Password reset ",
      text: resetLink,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent: " + info.response)
      }
    })

    res.json({ message: "Reset link sent successfully", resetLink })
  } catch (err) {
    res.send(err)
  }
}

const resetPassword = async (req, res) => {
  const { id, token } = req.params
  const { password } = req.body

  const user = await User.findOne({ _id: id })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  if (user.token != token) {
    return res.status(404).json({ message: "Invalid token" })
  }
  console.log(user)
  user.password = password
  user.token = ""
  await user.save()
  res.json({ message: "password reset success", success: true })
}

const getUserInfo = async (req, res) => {
  const { email } = req.user
  try {
    const user = await User.findOne(
      { email: email },
      { name: 1, email: 1, address: 1 }
    )
    res.json({ user })
  } catch (error) {
    res.json(error)
  }
}

const addAddress = async (req, res) => {
  const { address } = req.body
  const { email } = req.user
  try {
    const user = await User.findOne({ email: email })
    if (user?.address) {
      
      await Moralis.Streams.deleteAddress({
        id: `${process.env.Stream_ID}`,
        address: user?.address,
      })
      console.log("Address deleted")
    }
    const updateUser = await User.findOneAndUpdate(
      { email: email },
      { address: address },
      { new: true }
    )
      
    await Moralis.Streams.addAddress({
      id: `${process.env.Stream_ID}`,
      address: address,
    })
    console.log("Address added")
    res.json(updateUser)
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUserInfo,
  addAddress,
}
