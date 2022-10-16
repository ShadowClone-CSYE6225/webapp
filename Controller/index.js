const serviceLayer = require("../Services")
const bcrypt = require('bcryptjs');


// Success method
const setSuccess = (object, response) => {
    response.status(200);
    response.json(object);
  };
  
//Error method if we get error from MongoDB client
const setError = (error, response) => {
    response.status(500);
    response.json(error);
};

const getHealthz = async (request, response) =>{
    try{
        const health =await serviceLayer.getHealthzDetails();
        setSuccess(health, response);
    }catch(error){
        setError(error, response)
    }
}

const createAccount = async (request, response)=>{
    try{

    // Get user input
    const user = request.body;

    // Validate user input
    if (!(user.username && user.password && user.first_name && user.last_name)) {
        response.status(400).send("All inputs are required");
        return;
    }

    // check if user already exist return error with response code
    const isUserPresent = await serviceLayer.getUserByUsername(user.username);
    if(isUserPresent.length > 0){
        response.status(400).json("Email id already registered!");
        return;
    }
    

    // Create user in our database
    await serviceLayer.createNewAccount(user);
    const result = await serviceLayer.getUserByUsername(user.username);
    delete result[0].password;
    
    response.status(201).json(result);

    }catch(error){

        setError(error, response.status(400))

    }
}

const getAccount = async (request, response) =>{
    try{
        //Getting this username from AUth file.
        const username = request.username;
        const isUserPresent = await serviceLayer.getUser(request.params.accountId);
       if(isUserPresent.length !==0){
        const isAuthenticated = username === isUserPresent[0].username; 
        
        if(isAuthenticated){
            delete isUserPresent[0].password
            setSuccess(isUserPresent[0], response)
           
        }else {

            response.status(400).json({ error: "Username and Id doesn't match" });
       }
        }else{
            response.status(400).json({ error: "User doesn't exist" });
        }
        
         
    }catch(error){
        setError(error, response)
    }

}

const updateAccount = async(request, response)=>{

    
    if(request.body.username || request.body.account_created || request.body.account_updated || request.body.id){
        response.status(400).json("You are not allowed to edit few details in body")
        
    }else{


        //Getting this username from AUth file.
        const username = request.username;


        const isUserPresent = await serviceLayer.getUser(request.params.accountId);
        if(isUserPresent.length !==0){
          const isAuthenticated = username === isUserPresent[0].username; 
          
          if(isAuthenticated){

            const result = await serviceLayer.updateUser(request.params.accountId, request.body)
            if(result ===1){
                const user =  await serviceLayer.getUser(request.params.accountId);
        
                delete user[0].password
                setSuccess(user[0], response)
                return;
            }

          }
        }
    
   
    
}
}


module.exports = {getHealthz, createAccount,getAccount, updateAccount }