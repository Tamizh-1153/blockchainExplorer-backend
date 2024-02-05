const express = require('express')
const app =express()
const Moralis = require("moralis").default
const { EvmChain } = require("@moralisweb3/common-evm-utils")
require('dotenv').config()
const cors= require('cors')


//Moralis API
const MORALIS_API_KEY = process.env.MORALIS_API_KEY

//database
const connectDB = require('./db/connectDB')

//routes
const userRouter = require('./routes/user')
const blockchainRouter = require('./routes/blockchain')
const webhookRouter = require('./routes/webhook')


app.use(express.json())
app.use(cors())
app.use('/api/v1',userRouter)
app.use('/api/v1/blockchain',blockchainRouter)
app.use('/',webhookRouter)

app.get("/", (req, res) => {
  res.send("Blockchain Explorer website backend")
})



const start =async() => {
try {
    await connectDB(process.env.MONGO_URI)
    app.listen(5000,()=>{console.log('Server is listening on port 5000...')})
} catch (error) {
    console.log(error)
}
}

start()

const startMoralis = async() => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  })
  
}
startMoralis()







