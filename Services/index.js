const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const databaseModel = require('../Models')


module.exports.getHealthzDetails = function getHealthzDetails(){
    return 'Hello from Server side.'
}

module.exports.createNewAccount = async function createNewAccount(newUser){

   
    //Encrypt user password
   
   newUser.password =  await bcrypt.hash(newUser.password, 2);
  
    const result = await databaseModel.createQuery(newUser);
    if(result.rowCount === 1){
        

        return newUser
    } 
    

}

module.exports.getUser = async function getUserDetails(username){

 const result = await databaseModel.getQuery(username);    
return result.rows || null;
}

module.exports.updateUser = async function(username, updatedData){
    if(updatedData.password){
        updatedData.password = await bcrypt.hash(updatedData.password, 2);
    }


    const result = await databaseModel.updateQuery(username, updatedData)
    return result;
}