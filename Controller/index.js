const getHealthzDetails = require("../Services")

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
        const health =await getHealthzDetails.getHealthzDetails();
        setSuccess(health, response);
    }catch(error){
        setError(error, response)
    }
}
module.exports = getHealthz