const {getHealthz, createAccount,getAccount, updateAccount } =  require('../Controller')

const express = require("express");
const auth = require('../Middelware/auth');
const router = express.Router();

router.route("/healthz").get(getHealthz);
router.route("/v1/account").post(createAccount);


module.exports= function(app) {
    
app.use('/', router)
app.get('/v1/account/', auth, getAccount);
app.put('/v1/account', auth, updateAccount )

}