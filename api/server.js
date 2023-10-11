// 0xf30340148c22f07e5da8abb7e3b63af90e9ea346
//0x8B04f06cbb9A973b46f32Fe68304C6F475eA08Af(new)
const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const bodyParser = require('body-parser');
const { get_Name, get_Token, get_ID, get_Desc, get_balance,get_all, update_name} = require('./controller/index');
const {fetchDataAndStore} = require('./cron-job');
const app = express();
app.use(bodyParser.json());

cron.schedule('* * * * *', () => 
{
    console.log('Fetching data and updating database...');
    fetchDataAndStore();
});

process.on('exit', () => 
{
  pool.end();
  console.log('Cron job stopped.');
});
//user-/api/ethereum/create-task -> server.js -> routes.js -> controller.js -> tasks.js
app.use(cors());
app.post('/update-name', update_name);
app.get("/api/get_Name", get_Name);
app.get("/api/get_TokenName", get_Token);
app.get("/api/get_ID", get_ID);  
app.get("/api/get_Desc", get_Desc);
app.get("/api/get_balance", get_balance);
app.get("/api/get_all", get_all);


const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server Running At PORT ${PORT}`)
})
// app.use(express.json())
// app.use('/api/ethereum',tasks)

// app.post('/update-name', async (req, res) => {

//  try {
//     let { newName, userAddress } = req.body;
//     //Generate the transaction here, including estimating gas, encoding data, etc.
//     //console.log(newName);
//    // const gasAmount = await contract.methods.set_Name(newName).estimateGas({ from: userAddress });
//    //userAddress = req.body.userAddress.toLowerCase(); // Ensure it's lowercase and starts with '0x'
//    console.log(userAddress);
//   //userAddress = userAddress.trim();
//    //const gasAmount = await contract.methods.set_Name(newName).estimateGas({ from: userAddress})
//    //const gasAmountString = gasAmount.toString(); 
//    const data = await contract.methods.set_Name(newName).encodeABI();
//     // ethereum
//     //   .request({
//     //       method: 'eth_sendTransaction',
//     //       params: [
//     //           {
//     //               from: accounts[0], // User's active address from MetaMask.
//     //               to: contractAddress, // Contract address.
//     //               data: data, // Encoded data for the contract method call.
//     //               gasLimit: gasAmount, // Customizable gas limit.
//     //           },
//     //       ],
//     //   })
//     //   .then((txHash) => console.log(`Transaction Hash: ${txHash}`))
//     //   .catch((error) => console.error(error));
//    const transaction = {
//      from: userAddress,
//      to: contractAddress,
//      data: data,
//      gasLimit: 1000000,
//    };
//     res.json({ transaction });
//  } catch (error) {
//    console.error('Error generating transaction:', error);
//    res.status(500).json({ error: 'Internal server error' });
//  }
// });




// app.post('/broadcast-signed-transaction', async (req, res) => {
//   try {
//     const { signedTransaction } = req.body;
//     console.log(signedTransaction);
//     //const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
//     console.log(signedTransaction.rawTransaction);
//     //res.json({ transactionHash: receipt.transactionHash });
//   } catch (error) {
//     console.error('Error broadcasting transaction:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
