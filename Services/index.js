const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const databaseModel = require('../Models')
const { v4: uuidv4 } = require('uuid');
const s3 = require('../Config/s3')
const aws = require('aws-sdk');
const logger = require('../Config/Logger');
const { response } = require('express');
const sns = new aws.SNS({});
const dynamoDatabase = new aws.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION || 'us-east-1'
});


module.exports.getHealthzDetails = function getHealthzDetails(){
    return 'Hello from Server side.'
}

module.exports.createNewAccount = async function createNewAccount(newUser){

   
    //Encrypt user password
    newUser.password =  await bcrypt.hash(newUser.password, 2);
    
    const result = await databaseModel.createQuery(newUser);


    if(result.rowCount === 1) {
        const newResult = await databaseModel.getQueryByUsername(newUser.username);  
        const result = newResult.rows;

        //Send email for verification

        const token = uuidv4();
        const expiryTime = new Date().getTime();

        const item = {
            Item: {
                "Email": {
                    S: `${result[0].username}`
                },
                "TokenName":{ 
                S: `${token}`
                },
                "TimeToLive":{
                S: expiryTime.toString()
                },
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "csyeTokenTable"

        }
            
        

        try {

            const data = await dynamoDatabase.putItem(item, function(error, data){
                if(error) logger.error(error, error.stack)
                else return data
            })

            
            logger.info("Token stored successfully", data);

            const message = {
                'email': result[0].username,
                'token': token
            }

            const params = {
                Message: JSON.stringify(message),
                Subject: token,
                TopicArn: 'arn:aws:sns:us-east-1:272113043580:Email_Verification'
            }

            //Invoking Lambda function
            const publishTextToPromise = await sns.publish(params).promise();
            logger.info(publishTextToPromise, "Testing publishing item to SNS");
        } catch (error) {
            logger.error("Error in DynamoDB",error)
        }

        return newUser
    
    }

}

module.exports.verfiyEmail = async function verifyEmailAddress(email, token){

    const params = {
        Key:{
            "Email": {
                S: `${email}`
            },
            "TokenName": {
                S: `${token}`
            }
        },
        TableName: "csyeTokenTable"
    }
   let message = 0;
    dynamoDatabase.getItem(params,function(error, data){
        if(error) logger.info(error, error.stack);
        else{
            const timeToLive = data.Item.TimeToLive.S
            const currentTime = new Date().getTime();
            const time = (currentTime - timeToLive) / 60000;

            if(time < 2){
                databaseModel.verifyUserQuery(email);
                return "User successfully verified";
            }
            else{
                ++message;
                return;
            }
        }

      
    })
    return "Time's up, you are not verified"
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
    let fileName = file.originalname.replace(/\s+/g, "-")

    fileName =  `${username}` + fileName ;


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
    const params = {  Bucket: process.env.S3BUCKET, Key: `${data[0].name}` };
    
    
    s3.client.deleteObject(params, function(error, data) {
        if (error) return error.stack                  
      });

    const result = await databaseModel.deleteDocument(documentId, username);
    return "File successfully deleted";
} 