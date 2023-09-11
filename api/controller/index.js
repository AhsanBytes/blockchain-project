const pool = require('../db-pool');

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
    get_all
//     deleteTask,
//     viewTask,
//     allTasks
}