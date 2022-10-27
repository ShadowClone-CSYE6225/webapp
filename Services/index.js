const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const databaseModel = require('../Models')
const s3 = require('../Config/s3')


module.exports.getHealthzDetails = function getHealthzDetails(){
    return 'Hello from Server side.'
}

module.exports.createNewAccount = async function createNewAccount(newUser){

   
    //Encrypt user password
    newUser.password =  await bcrypt.hash(newUser.password, 2);
    
    const result = await databaseModel.createQuery(newUser);
    if(result.rowCount === 1) return newUser
   
    

}

module.exports.getUser = async function getUserDetails(accountId){
    

 const result = await databaseModel.getQuery(accountId);   
 console.log(result);
return result.rows || null;
}

module.exports.getUserByUsername = async function getUseDetailsByUsername(username){
    const result = await databaseModel.getQueryByUsername(username);    
    return result.rows || null;   
}

module.exports.updateUser = async function(accountId, updatedData){
    if(updatedData.password){
        updatedData.password = await bcrypt.hash(updatedData.password, 2);
    }


    const result = await databaseModel.updateQuery(accountId, updatedData)
    return result;
}

module.exports.uploadDocument = (file)=>{
    const params = {
        Bucket: s3.bucket_name,
        Key: file.originalname.replace(/\s+/g, "-"),    // replace space in a filename with hyphen
        Body: file.buffer
    };

        s3.client.upload(params, (error, data) => {
        if (error) {
            return error;

        }
            return data.Location;
        


        
    });
}