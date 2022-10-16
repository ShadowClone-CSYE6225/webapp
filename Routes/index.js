const {getHealthz, createAccount,getAccount, updateAccount } =  require('../Controller')

const express = require("express");
const auth = require('../Middelware/auth');
const router = express.Router();

router.route("/healthz").get(getHealthz);
router.route("/v1/account").post(createAccount);


module.exports= function(app) {
    
app.use('/', router)
//Below routes are authenticated with BASIC authentication
app.get('/v1/account/:accountId', auth, getAccount);
app.put('/v1/account/:accountId', auth, updateAccount )

}