const {contract}=require('./Contract/index');
const pool = require('./db-pool');
const cron = require('node-cron');

async function fetchDataAndStore() {
  try {
    const name = await contract.methods.Name().call();
    console.log(name);
    const tokenName = await contract.methods.TokenName().call(); 
    console.log(tokenName);

    let id = await contract.methods.ID().call();
    id = Number(id);
    console.log(id);
    const description = await contract.methods.Description().call();
    console.log(description);

    let balance = await contract.methods.getbalance().call();
    balance = Number(balance);

    console.log(balance);

    pool.query('UPDATE properties SET name=?, tokenName=?, id=?, description=?, balance=?', [name, tokenName, id, description, balance]);    
    console.log('Data updated successfully.');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function Cron() 
{
  cron.schedule('* * * * *', () => {
    console.log('Fetching data and updating database...');
    fetchDataAndStore();
  });
  
  process.on('exit', () => {
    pool.end();
    console.log('Cron job stopped.');
  });
}

module.exports={
    Cron
}