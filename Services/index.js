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

module.exports.uploadDocument = async(file, username)=>{
    const fileName = file.originalname.replace(/\s+/g, "-")



    const fileExists = await databaseModel.checkDocumentExists(fileName, username);

    if(fileExists >0){
        return "File Already Exists, Please upload different file";
    }

    const params = {
        Bucket: s3.bucket_name,
        Key: fileName,    // replace space in a filename with hyphen
        Body: file.buffer
    };

         const result = s3.client.upload(params, async (error, data) => {
        if (error) {
            return error;

        }else{
        const fileDetails = {filePath: data.Location, fileName: fileName};
         const result = await databaseModel.createDocumentQuery(fileDetails, username);
        //  return result.rowCount;
        }   
        
        
    });
    return "Document successfully uploaded";

}


module.exports.getAllDocuments = async(username)=>{
    const result = await databaseModel.getAllDocumentsByAUser(username);
    return result;
}

module.exports.getDocument = async(documentId, username) =>{
    const result = await databaseModel.getSingleDocument(documentId, username);
    return result;
}

module.exports.deleteDocument = async(documentId, username) =>{



    const data = await databaseModel.getSingleDocument(documentId, username);
    const params = {  Bucket: 'pratiktalrejatestbucket', Key: `${data[0].name}` };
    
    
    s3.client.deleteObject(params, function(error, data) {
        if (error) return error.stack                  
      });

    const result = await databaseModel.deleteDocument(documentId, username);
    return "File successfully deleted";
} 