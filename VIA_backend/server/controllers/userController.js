const User = require("../models/users")


//Get All user
exports.getAlluser=async(req,res)=>{
   try{
      
      
   const data=await User.find()
   res.json(data)
   }catch(err){
    console.log(err);
    
   }

}