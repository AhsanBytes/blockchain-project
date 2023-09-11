# blockchain-project
This is a BERN app or react app in which we show the complete state of a smart contract, this involve 
smart contract having properties like Name, TokenName, ID, Description, owners mapping and balances 
mapping. We have made setter and getter functions of all these properties.It includes cron job using 
web3.js that is getting state of all variables using its public functions. The cron job is running 
after 1 minute and update the status of contract in the database.It has Node JS-based backend public 
endpoint, which will retrieve the state from the database on request.And a simple frontend app, that 
requests the backend and shows the latest state on every reload.

Firstly, create smart contract on remix ide and inject metamask and deploy it on ethereum testnet. Copy ABI in .json file and also deployed contrat Address.
Then create infura project and copy API key. (Infura software is used to make blockchain node)
Create backend and make connection to metamask first and then connect backend with smart contract using ABI and Contract address. 
Connect db with backend, Make routes for reading the data from database and write node-cron to update data in database from contract.
Now make a front-end that will fetch data for reading from db, and write or update data in smart contract directly bcz if to write from backend, it will need our private key.
Therefore, we update or write in smart contract using frontend.

#In this project, frontend is not updating data in smart contract, and having a error...
