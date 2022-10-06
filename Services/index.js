const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const config = require('../config');
const databaseModel = require('../Models')


module.exports.getHealthzDetails = function getHealthzDetails(){
    return 'Hello from Server side.'
}

module.exports.createNewAccount = async function createNewAccount(newUser){

    //Encrypt user password
   
   newUser.password =  await bcrypt.hash(newUser.password, 2);
  
    const result = await databaseModel.createQuery(newUser);
    console.log(result.rows);
    return "Pratik"

}

module.exports.getUser = async function getUserDetails(){
    
 const result = await databaseModel.getQuery();
 return result.rows;
}