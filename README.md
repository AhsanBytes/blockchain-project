# blockchain-project
This is a BERN app or react app in which we show the complete state of a smart contract, this involve 
smart contract having properties like Name, TokenName, ID, Description, owners mapping and balances 
mapping. We have made setter and getter functions of all these properties.It includes cron job using 
web3.js that is getting state of all variables using its public functions. The cron job is running 
after 1 minute and update the status of contract in the database.It has Node JS-based backend public 
endpoint, which will retrieve the state from the database on request.And a simple frontend app, that 
requests the backend and shows the latest state on every reload.
