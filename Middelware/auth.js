const serviceLayer = require("../Services")
const bcrypt = require('bcryptjs');
const { request } = require("express");


async function auth (req, res, next){

    
    var authHeader = req.headers.authorization;
    if(!authHeader){
        var err = new Error('You are not authenticated')

        res.setHeader('WWW-Authenticate','Basic');
        err.status = 401
        next(err)
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':')
    var username = auth[0]
    var password = auth[1]

    const isUserPresent = await serviceLayer.getUser(username);
    
    if((username === isUserPresent[0]?.username) && await bcrypt.compare(password, isUserPresent[0]?.password)){
        request.username = username;
        next();
    }else{
        var err = new Error('You are not')

        res.setHeader('WWW-Authenticate','Basic');
        // res.json();
        res.status(401).json("You are not authenticated")
        err.status = 401
        next(err)
    }

}

module.exports = auth;

