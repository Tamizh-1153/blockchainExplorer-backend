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


app.use(express.json())
app.use(cors())
app.use('/api/v1',userRouter)
app.use('/api/v1/blockchain',blockchainRouter)

app.get("/", (req, res) => {
  res.send("Blockchain Explorer website backend")
})

// app.post('/webhook',async(req,res)=>{
//   const {body} = req
//   try {
//     console.log(body)
//     res.json('hi')
//   } catch (error) {
//     res.json(error.message)
//   }
// })

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

// const streams = async()=>{
//   const response = await Moralis.Streams.add({
//     webhookUrl: "https://blockchain-explorer-tm.onrender.com/webhook", // replace with your own webhook URL
//     description: "My first stream",
//     tag: "my_stream",
//     chains: ["0x1"],
//     includeNativeTxs: true,
//   })
//   console.log(response.toJSON().id)
  
// }
// streams()


