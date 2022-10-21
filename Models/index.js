const { Pool } = require('pg')
const dotenv = require('dotenv');

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
        return model.query(query)

    }catch(error){
        return error
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