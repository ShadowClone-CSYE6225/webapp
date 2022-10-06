const serviceLayer = require("../Services")
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
    }

    // check if user already exist
    // Validate if user exist in our database
    // const oldUser = await User.findOne({ username });

    // if (oldUser) {
    //   return res.status(409).send("User Already Exist. Please Login");
    // }

    

    // Create user in our database
    const result = await serviceLayer.createNewAccount(user);
    
  
      // Create token
      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      response.status(201).json(user);


    }catch(error){

    }
}

const getAccount = async (request, response) =>{
    try{

       const result =  await serviceLayer.getUser();
        setSuccess(result, response);
    }catch(error){

    }

}
module.exports = {getHealthz, createAccount,getAccount }