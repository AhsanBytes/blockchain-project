const {Web3}= require("web3");
const ABI = require("./ABI.json");

const web3 = new Web3("https://goerli.infura.io/v3/4d9b1ef176d64df9b4484f44e626bc0d");
const contractAddress = "0xf30340148c22f07e5da8abb7e3b63af90e9ea346";
const contract = new web3.eth.Contract(ABI, contractAddress);



module.exports={contract}