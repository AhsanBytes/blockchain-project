require('dotenv').config();
const { Web3 } = require("web3");
const ABI = require("./ABI.json");
const PKIUnits_ABI = require("./PKIUnits_ABI.json");
const infuraUrl = process.env.INFURA_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const pkicontractaddress = process.env.PKIUNITS_CONTRACT_ADDRESS;

const web3 = new Web3(infuraUrl);
const contract = new web3.eth.Contract(ABI, contractAddress);
const pkicontract = new web3.eth.Contract(PKIUnits_ABI, pkicontractaddress);

module.exports={contract, pkicontract};