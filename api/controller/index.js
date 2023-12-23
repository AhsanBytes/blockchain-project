require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { Web3 } = require("web3");
const pool = require('../db-pool');
const { contract, pkicontract } = require('../Contract/index');
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
const privateKey = process.env.PRIVATE_KEY;
const pkicontractAddress = process.env.PKIUNITS_CONTRACT_ADDRESS;
const contractAddress = process.env.CONTRACT_ADDRESS;
const infuraUrl = process.env.INFURA_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(`${infuraUrl}`,),);
const stripe = require("stripe")(stripe_secret_key);


// Creating a signing account from a private key
const signer = web3.eth.accounts.privateKeyToAccount(privateKey,);
web3.eth.accounts.wallet.add(signer);

const MAX_RETRIES = 3; // Maximum number of retries
const RETRY_DELAY_MS = 5000; // Delay between retries (in milliseconds)

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

// Define a function to send MATIC with retries
const sendMATICWithRetries = async (toAddress, amountInWei, gasAmount, gasPrice, maxRetries, retryDelay) => {
    let retries = 0;
    let success = false;
    let receipt;

    while (!success && retries < maxRetries) {
        try {
            receipt = await sendMATIC(toAddress, amountInWei, gasAmount, gasPrice);
            success = true;
        } catch (error) {
            console.error(`Failed to send MATIC on attempt ${retries + 1}. Retrying in ${retryDelay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Delay before retry
            retries++;
        }
    }

    if (!success) {
        throw new Error(`Failed to send MATIC after ${maxRetries} retries.`);
    }

    return receipt;
};

const update_name = async (req, res) => {
    try {
        let { newName, userAddress } = req.body;
        console.log(userAddress);
        // Remove extra characters from userAddress
        userAddress = userAddress.replace(/"/g, '');

        // Ensure userAddress has '0x' prefix
        if (!userAddress.startsWith('0x')) {
            userAddress = '0x' + userAddress;
        }
        console.log(userAddress);

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
        //const receipt = await sendMATIC(userAddress, maticAmountInWei, gasAmountString, gasPrice);
        const receipt = await sendMATICWithRetries(userAddress, maticAmountInWei, gasAmountString, gasPrice, MAX_RETRIES, RETRY_DELAY_MS);

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

const get_wallet_balance = async (req, res) => {
    try {
        let { Address } = req.body;
        const balanceWei = await web3.eth.getBalance(Address);
        // Convert wei to Matic (1 Matic = 10^18 wei)
        const balanceMATIC = web3.utils.fromWei(balanceWei, "wei") / Math.pow(10, 18);
        res.json({ balance: balanceMATIC });
    } catch (error) {
        console.error("Error loading balance:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const get_PKIUnits = async (req, res) => {
    try {
        let { Address } = req.body;
        if (!pkicontract) {
            throw new Error('PKIUnits contract not initialized.');
        }
        let getpki = await pkicontract.methods.balanceOf(Address).call() ;
        //const val = 
        //console.log(getpki);
        getpki = Number(getpki);
        getpki = getpki* Math.pow(10, -18);
        res.json({ getpki });
    } catch (error) {
        console.error("Error loading pkiunits balance: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const get_stripe = (req, res, next) => {
    console.log("Get Response from researcher");
    res.json({
        message: 'It Works'
    });
}

const pay_stripe_and_update_pki = async (req, res, next) => {
    try {
        const { token, amount, address } = req.body;

        // Handle the Stripe payment
        const stripeResponse = await payStripe(token, amount);

        // Check if the Stripe payment was successful
        if (stripeResponse.status === 'succeeded') {
            // Calculate PKIUnits based on the exchange rate (1 USD = 1.5 PKI)
            const exchangeRate = 1;
            const pkiUnitsToAdd = amount * exchangeRate;

            // Convert amount to Wei
            //const valueInWei = web3.utils.toWei(pkiUnitsToAdd.toString(), 'gwei'); // or 'wei'

            const valueInWei = pkiUnitsToAdd * Math.pow(10, 18);            
            //web3.utils.toWei(pkiUnitsToAdd.toString(), 'ether');

            // Use the transfer function of the PKIUnits contract to send tokens
            const transferTx = pkicontract.methods.transfer(address, valueInWei);

            // Get gas estimate
            const gas = await transferTx.estimateGas({ from: signer.address });

            // Build the transaction
            const data = transferTx.encodeABI();
            const nonce = await web3.eth.getTransactionCount(signer.address);
            const gasPrice = await web3.eth.getGasPrice();

            const rawTransaction = {
                nonce,
                gasPrice,
                gasLimit: gas,
                to: pkicontractAddress,
                value: '0x0',
                data,
            };

            // Sign the transaction
            const signedTxn = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);

            // Send the signed transaction
            const receipt = await web3.eth.sendSignedTransaction(signedTxn.rawTransaction);
            console.log(receipt);

            res.status(200).json({
                success: true,
                getpki: pkiUnitsToAdd,
            });
        } else {
            throw new Error('Stripe payment failed.');
        }
    } catch (error) {
        console.error('Error processing payment and updating PKIUnits:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const payStripe = async (token, amount) => {
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token
    }).then(customer => {
        return stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, { idempotencyKey });
    });
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
    update_name,
    get_wallet_balance,
    get_PKIUnits,
    get_stripe,
    pay_stripe_and_update_pki
};