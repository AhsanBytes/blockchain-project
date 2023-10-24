const pool = require('../db-pool');
const { contract } = require('../Contract/index');
const contractAddress = "0xF30340148C22F07e5Da8AbB7e3b63af90E9ea346";
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require("web3");
//const web3 = new Web3("https://polygon-mumbai.infura.io/v3/24713264536d4fc6aa7634314472023d");
const privateKey = process.env.PRIVATE_KEY;
const adminPrivateKey = privateKey; // Replace with your admin's private key
const provider = new HDWalletProvider(adminPrivateKey, "https://polygon-mumbai.infura.io/v3/24713264536d4fc6aa7634314472023d"); // Replace with your Infura project ID
const web3 = new Web3(provider);

const update_name = async (req, res) => {
    try {
        let { newName, userAddress } = req.body;

        // Remove extra characters from userAddress
        userAddress = userAddress.replace(/"/g, '');

        // Ensure userAddress has '0x' prefix
        if (!userAddress.startsWith('0x')) {
            userAddress = '0x' + userAddress;
        }
        // Estimate gas
        const gasAmount = await contract.methods.set_Name(newName).estimateGas({ from: userAddress });
        const gasAmountString = gasAmount.toString();
        // Encode transaction data
        const data = await contract.methods.set_Name(newName).encodeABI();

        // Create transaction object
        const transaction = {
            from: userAddress,
            to: contractAddress,
            data: data,
            gasLimit: gasAmountString,
        };

        // web3.eth.getAccounts()
        // .then(console.log);
        console.log(userAddress);
        // // Send MATIC to user's address
        // Define the amount in Matic (in wei)
        // // Matic amount you want to convert
        // const maticAmount = 0.000001; // Replace with the amount you want to convert
        // // Increase the gas limit for the transaction

        // // Convert Matic to Wei
        // const maticInWei = web3.utils.toWei(maticAmount.toString(), "mwei");
        // // Send MATIC to user's address
        // await web3.eth.sendTransaction({
        //     from: "0xcdb96Fd220b361206BC63834B8fF8A17c020BC21", // Admin's address
        //     to: userAddress,
        //     value: maticInWei,
        // });
        sendMaticToUser(userAddress)
            .then(result => {
                console.log(result);
                // Handle the result
            })
            .catch(error => {
                console.error(error);
                // Handle the error
            });
        res.json({ transaction });

    } catch (error) {
        console.error('Error generating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function sendMaticToUser(userAddress) {
    try {
        const maticAmount = "1000000000000000"; // 1.0 MATIC in wei
        const adminAddress = "0xcdb96Fd220b361206BC63834B8fF8A17c020BC21"; // Replace with your admin's address

        // Calculate the gas cost for the transaction
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 53000; // This is the standard gas limit for sending MATIC

        // Convert MATIC amount to wei
        const maticAmountInWei = web3.utils.toWei(maticAmount, 'wei');

        // Check if the admin has sufficient balance
        const adminBalanceInWei = await web3.eth.getBalance(adminAddress);

        if (BigInt(adminBalanceInWei) < BigInt(maticAmountInWei)) {
            throw new Error('Insufficient balance in the admin account to perform this transaction.');
        }

        // Create a transaction object to send MATIC
        const transactionObject = {
            from: adminAddress,
            to: userAddress,
            value: maticAmountInWei,
            gas: gasLimit,
            gasPrice: gasPrice,
        };

        // Send the transaction
        const receipt = await web3.eth.sendTransaction(transactionObject);

        if (receipt && receipt.status) {
            console.log('Transaction successful. Transaction hash:', receipt.transactionHash);
            return 'Successfully sent Matics to the user account';
        } else {
            throw new Error('Transaction failed. Please check the transaction on a blockchain explorer.');
        }
    } catch (error) {
        console.error('Error sending MATIC:', error);
        throw new Error('Internal server error');
    }
}



const get_Name = async (req, res) => {
    pool.query("SELECT Name from properties WHERE ID=1", (error, result) => {
        if (error) {
            console.log(error);
        }

        res.send(result);
    });
    // try
    // {
    //     const data = await contract.methods.Name().call();
    //     res.status(200).json({status:200, data,message:"Name Exist"})
    // }
    // catch(error)
    // {
    //     res.status(500).json({status:500,message:"Does not exist"})
    // }
}

const get_Token = async (req, res) => {
    pool.query("SELECT TokenName from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
    // try
    // {
    //     const data = await contract.methods.TokenName().call();
    //     res.status(200).json({status:200, data,message:"TokenName Exist"})
    // }
    // catch(error)
    // {
    //     res.status(500).json({status:404,message:"Does not exist"})
    // }
}

const get_ID = async (req, res) => {
    pool.query("SELECT ID from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
    // try
    // {
    //     const data = await contract.methods.ID().call();
    //     const numid = Number(data);
    //     res.status(200).json({status:200, numid,message:"ID Exist"})
    // }
    // catch(error)
    // {
    //     res.status(500).json({status:404,message:"Does not exist"})
    // }
}

const get_Desc = async (req, res) => {
    pool.query("SELECT Description from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
    // try
    // {
    //     const data = await contract.methods.Description().call();
    //     res.status(200).json({status:200, data,message:"Description Exist"})
    // }
    // catch(error)
    // {
    //     res.status(500).json({status:404,message:"Does not exist"})
    // }
}

const get_balance = async (req, res) => {
    pool.query("SELECT balance from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
    // try
    // {
    //     const data = await contract.methods.getbalance().call();
    //     const temp = Number(data);
    //     res.status(200).json({status:200, temp, message: "Exist"})
    // }
    // catch(error)
    // {
    //     res.status(500).json({status:404,message:"Does not exist"})
    // }
}
const get_all = async (req, res) => {

    const account = req.query.account;

    console.log('Account:', account);

    res.send(account);
};


module.exports = {
    get_Name,
    get_Token,
    get_ID,
    get_Desc,
    get_balance,
    get_all,
    update_name
    //     deleteTask,
    //     viewTask,
    //     allTasks
};