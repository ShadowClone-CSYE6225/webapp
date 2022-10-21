const routes = require('./Routes')
const express= require('express')
const dotenv = require('dotenv');
dotenv.config();
const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host:process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    logging: false
  })
  


const app=express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3200;





routes(app);
app.listen(PORT,'127.0.1.0', ()=>{
})