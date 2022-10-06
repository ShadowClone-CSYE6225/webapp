const {getHealthz, createAccount,getAccount } =  require('../Controller')

const express = require("express");
const router = express.Router();

router.route("/healthz").get(getHealthz);
router.route("/v1/account").post(createAccount);
router.route('/getAccount').get(getAccount);

module.exports= function(app) {
app.use('/', router)

}