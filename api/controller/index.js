require('dotenv').config();
const { Web3 } = require("web3");
const pool = require('../db-pool');
const { contract } = require('../Contract/index');
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const infuraUrl = process.env.INFURA_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(`${infuraUrl}`,),);

// Creating a signing account from a private key
const signer = web3.eth.accounts.privateKeyToAccount(privateKey,);
web3.eth.accounts.wallet.add(signer);

// Define a function to send MATIC
const sendMATIC = async (toAddress, amountInWei, gasAmount, gasPrice) => {
    // Creating the transaction object
    const tx = {
        from: signer.address,
        to: toAddress,
        value: amountInWei,
        gas: gasAmount,
        gasPrice: gasPrice,
    };
    // Assigning the right amount of gas
    tx.gas = await web3.eth.estimateGas(tx);

    // Sending the transaction to the network
    const receipt = await web3.eth.sendTransaction(tx).once("transactionHash", (txhash) => {
        console.log(`Mining transaction ...`);
        console.log(`Transaction hash: ${txhash}`);
    });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
    return receipt;
};

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

        // Create a transaction object
        const transaction = {
            from: userAddress,
            to: contractAddress,
            data: data,
            gas: gasAmountString,
        };

        const maticAmountInWei = "1000000000000000"; // 1.0 MATIC in wei

        // Calculate the gas cost for the transaction
        const gasPrice = await web3.eth.getGasPrice();

        // Check if the admin has sufficient balance
        const adminBalanceInWei = await web3.eth.getBalance(signer.address);

        if (BigInt(adminBalanceInWei) < BigInt(maticAmountInWei)) {
            throw new Error('Insufficient balance in the admin account to perform this transaction.');
        }

        // Call the sendMATIC function to send MATIC
        const receipt = await sendMATIC(userAddress, maticAmountInWei, gasAmountString, gasPrice);

        if (receipt && receipt.status) {
            res.json({ transaction });
        } else {
            throw new Error('Transaction failed. Please check the transaction on a blockchain explorer.');
        }
    } catch (error) {
        console.error('Error generating or sending transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const get_Name = async (req, res) => {
    pool.query("SELECT Name from properties WHERE ID=1", (error, result) => {
        if (error) {
            console.log(error);
        }

        res.send(result);
    });
}

const get_Token = async (req, res) => {
    pool.query("SELECT TokenName from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
}

const get_ID = async (req, res) => {
    pool.query("SELECT ID from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
}

const get_Desc = async (req, res) => {
    pool.query("SELECT Description from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
}

const get_balance = async (req, res) => {
    pool.query("SELECT balance from properties", (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
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
};