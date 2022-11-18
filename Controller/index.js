const serviceLayer = require("../Services")
const logger = require('../Config/Logger')
const statsD = require('node-statsd'), client = new statsD();
const startTime = new Date();


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

const getHealthz = async (request, response, next) =>{
    try{
        client.timing('Health.Call',startTime);
        const health =await serviceLayer.getHealthzDetails();
        logger.info('Health Check working fine.', health);   
        client.increment('endpoint.healthz');
        setSuccess(health, response); 
    }catch(error){
        logger.error(error);
        setError(error, response)
    }
}

const createAccount = async (request, response)=>{
    try{
        client.timing("AccountCreation.Call",startTime)

    // Get user input
    const user = request.body;

    // Validate user input
    if (!(user.username && user.password && user.first_name && user.last_name)) {
        logger.error("Some inputs missing in the request", user)
        response.status(400).send("All inputs are required");
        return;
    }

    // check if user already exist return error with response code
    const isUserPresent = await serviceLayer.getUserByUsername(user.username);
    if(isUserPresent.length > 0){
        logger.debug("Email id Already used: ", user.username)
        response.status(400).json("Email id already registered!");
        return;
    }
    

    // Create user in our database
    await serviceLayer.createNewAccount(user);
    const result = await serviceLayer.getUserByUsername(user.username);
    delete result[0].password;
    logger.info("Account created for user: "+result[0].first_name)
    client.increment('endpoint.CreateAccount');

    response.status(201).json(result);

    }catch(error){
        client.increment('endpoint.CreateAccount');
        logger.error(error)
        setError(error, response.status(400))

    }
}


const verifyAccount = async (request, response)=>{
    
   const token = `${request.query.token}`;
   const email = `${request.query.email}`;
   const isUserPresent = await serviceLayer.getUserByUsername(email);
   

   if (isUserPresent.length > 0) {
    
        if(isUserPresent[0].verified){
            logger.info(`Email: ${email} already verified`)
            response.status(200).json("User already verified, ready to use all the authenticated links")
            return;
        }else{
            const result = await serviceLayer.verfiyEmail(email, token);
            const isEmailVerified = await serviceLayer.getUserByUsername(email);
            if(isEmailVerified[0].verified){
            logger.info(`User: ${email} Successfully Verified`);
            response.json("User Successfully Verified");
            return;
            }
            else{
                logger.info("Exiting Verification, user not verified")
                response.status(400).json(result) 
            }
        }

   } else {
    logger.info(`Invalid email id, check your email id: ${email}`, );
    response.status(400).json({Error: "Invalid email id, check your email id"})
   }


}

const getAccount = async (request, response) =>{
    try{
        //Getting this username from AUth file.
        const username = request.username;
        const isUserPresent = await serviceLayer.getUser(request.params.accountId);
       if(isUserPresent.length !==0){
        const isAuthenticated = username === isUserPresent[0].username; 
        const isVerified = isUserPresent[0].verified;

        if(isVerified){
        if(isAuthenticated){
            delete isUserPresent[0].password
            setSuccess(isUserPresent[0], response)
           
        }else {

            response.status(400).json({ error: "Username and Id doesn't match" });
       }
    }else{
        response.status(400).json({error: "User is not verified"});
        logger.info(`User: ${isUserPresent[0].first_name} is not verified, please verify the user`)
    }
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
          const isVerified = isUserPresent[0].verified;

          if(isVerified){
          if(isAuthenticated){

            
            const result = await serviceLayer.updateUser(request.params.accountId, request.body)
            if(result ===1){
                const user =  await serviceLayer.getUser(request.params.accountId);
        
                delete user[0].password
                setSuccess(user[0], response)
                return;
            }

          }
        }else{
            response.status(400).json({error: "User is not verified"});
        logger.info(`User: ${isUserPresent.first_name} is not verified, please verify the user`)
        }
    
    }
    
   
    
}
}

const uploadDocument= async(request, response)=>{
    try{
    if(!request.file){
        response.status(400).json({error: "Please select a file to upload"});
    }
    const result = await (serviceLayer.uploadDocument(request.file, request.username));

    response.status(201).json(result);
}catch(error){
    response.status(400)
}
}


const getAllDocuments = async (request, response) =>{

    const result = await(serviceLayer.getAllDocuments(request.username));
    response.status(200).json(result);
}

const getDocument = async (request,response) =>{

    const result = await(serviceLayer.getDocument(request.params.documentId, request.username));
    response.status(200).json(result);

}

const deleteDocument= async (request, response) =>{
    const result = await(serviceLayer.deleteDocument(request.params.documentId, request.username));
    response.status(201).json(result);

}


module.exports = {getHealthz, createAccount,getAccount, updateAccount, uploadDocument, getAllDocuments, getDocument,deleteDocument, verifyAccount }