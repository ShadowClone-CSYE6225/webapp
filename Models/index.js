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

module.exports.getQuery = async function(username) {
    
   return await model.query(`SELECT id,first_name,last_name, username, account_created, account_updated from accounts WHERE username='${username}'`);
}

module.exports.createQuery = async function(newUser) {
    try{
        const query = `INSERT INTO accounts (first_name,last_name,"password", username, account_created) VALUES('${newUser.first_name}', '${newUser.last_name}', '${newUser.password}', '${newUser.username}', CURRENT_TIMESTAMP);`
        model.connect();
        return model.query(query)

    }catch(error){
        console.log(error);
    }
}