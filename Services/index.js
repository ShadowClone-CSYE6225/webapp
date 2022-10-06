const jwt = require('jsonwebtoken');
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
        const token = jwt.sign({id: newUser.userName}, process.env.TOKEN_KEY, {
            expiresIn: 86400
        });

        return {username: newUser.username, token}
    } 
    

}

module.exports.getUser = async function getUserDetails(user){
    
 const result = await databaseModel.getQuery(user.username);    
return result.rows || null;
}