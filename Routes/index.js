const getHealthz =  require('../Controller')
const express = require("express");
const router = express.Router();

router.route("/healthz").get(getHealthz)

module.exports= function(app) {
app.use('/', router)

}