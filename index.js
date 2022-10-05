const routes = require('./Routes')
const express= require('express');
const { Client } = require('pg')


const app=express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3200;



//Postgres Database

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  })
  client.connect()
 client.end();





routes(app);
app.listen(PORT, ()=>{
    console.log("Server is Running")
})