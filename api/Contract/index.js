//0xf30340148c22f07e5da8abb7e3b63af90e9ea346
const {Web3}= require("web3");
const ABI = require("./ABI.json");

const web3 = new Web3("https://polygon-mumbai.infura.io/v3/24713264536d4fc6aa7634314472023d");
const contractAddress = "0xF30340148C22F07e5Da8AbB7e3b63af90E9ea346";
const contract = new web3.eth.Contract(ABI, contractAddress);

module.exports={contract}