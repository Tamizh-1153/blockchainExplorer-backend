const Moralis = require("moralis").default
const { EvmChain } = require("@moralisweb3/common-evm-utils")
const Blockchain = require("../models/blockchain")

const getWalletDetails = async (req, res) => {
  const { id } = req.params
  try {
    const wallet = await Blockchain.findOne({ address: id })
    console.log(wallet)
    if (!wallet) {
      const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
        chain: "0x1",
        address: `${id}`,
      })

      const ethPrice = await Moralis.EvmApi.token.getTokenPrice({
        chain: "0x1",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      })

      const transactions =
        await Moralis.EvmApi.transaction.getWalletTransactions({
          chain: "0x1",
          limit: 25,
          address: `${id}`,
        })

      const ERC20TokenBalanceRaw =
        await Moralis.EvmApi.token.getWalletTokenBalances({
          chain: "0x1",
          address: `${id}`,
        })

      const nativeBal = nativeBalance.raw.balance / 10 ** 18
      const ethValue = ethPrice.raw.usdPrice * nativeBal
      const ERC20TokenBalance =
        ERC20TokenBalanceRaw.raw[0].balance / 10 ** 18 +
        " " +
        ERC20TokenBalanceRaw.raw[0].symbol

      const wallet = await Blockchain.create({
        address: id,
        nativeBal,
        ethValue,
        transactions: transactions.raw.result,
        ERC20TokenBalance,
      })
      res.json({wallet})
    }
    else {
        const wallet  = await Blockchain.findOne({address: id})
        setInterval(async () => {
          await Blockchain.deleteOne({ address: id })
        }, 3600000)
        res.json({wallet})
    }

  } catch (e) {
    console.error(e)
  }
}

const getTransactionByHash =async(req,res) => {
    const {id}= req.params
    console.log(id);

    const transaction = await Moralis.EvmApi.transaction.getTransaction({
      chain: "0x1",
      transactionHash:
        `${id}`,
    })
    console.log(transaction.raw);
    res.json(transaction.raw)
}

module.exports = {
  getWalletDetails,
  getTransactionByHash
}
