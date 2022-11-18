const { Pool } = require('pg')
const dotenv = require('dotenv');
const logger = require('../Config/Logger');

dotenv.config();


//Postgres Database

const model = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

module.exports.getQuery = async function(accountId) {
    //id,first_name,last_name, username, account_created, account_updated
    try {
        return await model.query(`SELECT * from accounts WHERE id=${accountId}`);
    } catch (error) {
        return error
    }
   
}

module.exports.getQueryByUsername = async function(username) {
    //id,first_name,last_name, username, account_created, account_updated
    try {
        return await model.query(`SELECT * from accounts WHERE username='${username}'`);
    } catch (error) {
        return error
    }
   
}

module.exports.createQuery = async function(newUser) {
    try{

        const query = `INSERT INTO accounts (first_name,last_name,"password", username, account_created) VALUES('${newUser.first_name}', '${newUser.last_name}', '${newUser.password}', '${newUser.username}', CURRENT_TIMESTAMP);`
        model.connect();
        return await model.query(query)

    }catch(error){
        return error
    }
}

module.exports.verifyUserQuery = async function(email){
    try {
        const query = `UPDATE ACCOUNTS SET verified = ${true}, account_updated = NOW() WHERE USERNAME = '${email}'`
        model.connect();
        logger.info(`User: ${email} is now verified.`)
        return  (await model.query(query)).rowCount;
    } catch (error) {
        logger.error(error);
        return error;
    }
}

module.exports.updateQuery = async function(accountId,updatedData){

    try{
        let query = `UPDATE ACCOUNTS SET `;
        for(const key in updatedData){
            query+=`${key} = '${updatedData[key]}', `
        }
        query+=`account_updated = NOW() WHERE id=${accountId}`

        model.connect();
        return (await model.query(query)).rowCount;
    }catch(error){
        return error

    }
}


module.exports.createDocumentQuery = async function(fileDetails, username){
    try{
        let query = `INSERT INTO \"Documents\" (user_id, name, s3_bucket_path, date_created) VALUES('${username}', '${fileDetails.fileName}', '${fileDetails.filePath}' , CURRENT_TIMESTAMP);`
        model.connect();
        return await model.query(query)


    }catch(error){
        return error
    }
}

module.exports.getSingleDocument = async function(documentId, username){
    try{
        let query = `SELECT * FROM \"Documents\" WHERE user_id='${username}' AND doc_id='${documentId}'; `
        model.connect();
        return (await model.query(query)).rows


    }catch(error){
        return error
    }
}

module.exports.getAllDocumentsByAUser = async function(username){
    try{
        let query = `SELECT * FROM \"Documents\" WHERE user_id='${username}'; `
        model.connect();
        return (await model.query(query)).rows;


    }catch(error){
        return error
    }
}

module.exports.deleteDocument = async function(documentId, username){
    try{
        let query = `DELETE FROM \"Documents\" WHERE user_id='${username}' AND doc_id=${documentId};`
        model.connect();
        return ( (await model.query(query)).rowCount)


    }catch(error){
        return error    
    }
}

module.exports.checkDocumentExists = async function(documentName, username){
    try{

        let query = `SELECT * FROM \"Documents\" WHERE name='${documentName}' AND user_id = '${username}';`
        model.connect();
        return (await model.query(query)).rowCount

    }catch(error){
        return error
    }
}