const pool = require('../db-pool');
const {contract}=require('../Contract/index');
const contractAddress = "0xf30340148c22f07e5da8abb7e3b63af90e9ea346";

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
  
      res.json({ transaction });
    } catch (error) {
      console.error('Error generating transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

 const get_Name = async (req,res)=>{
    pool.query("SELECT Name from properties WHERE ID=1", (error,result)=>{
        if(error)
        {
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

const get_Token = async(req,res)=>{
    pool.query("SELECT TokenName from properties", (error,result)=>{
        if(error)
        {
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

const get_ID = async(req,res)=>{
    pool.query("SELECT ID from properties", (error,result)=>{
        if(error)
        {
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

const get_Desc = async(req,res)=>{
    pool.query("SELECT Description from properties", (error,result)=>{
        if(error)
        {
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

const get_balance = async(req,res)=>{
    pool.query("SELECT balance from properties", (error,result)=>{
        if(error)
        {
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
    const get_all = async (req,res)=>{
    
        const account = req.query.account;

        console.log('Account:', account);
      
        res.send(  account);
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
}