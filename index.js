const routes = require('./Routes')
const express= require('express');
const app=express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3200;

routes(app);

app.listen(PORT, ()=>{
    console.log("Server is Running")
})