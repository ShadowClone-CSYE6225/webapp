const {getHealthz, createAccount,getAccount, updateAccount, uploadDocument, getAllDocuments, getDocument, deleteDocument, verifyAccount } =  require('../Controller')

const express = require("express");
const upload = require('../Middelware/multer');
const auth = require('../Middelware/auth');
const router = express.Router();

router.route("/healthz").get(getHealthz);
router.route("/v1/account").post(createAccount);


module.exports= function(app) {
    
app.use('/', router)
//Below routes are authenticated with BASIC authentication
app.get('/v1/account/:accountId', auth, getAccount);
app.put('/v1/account/:accountId', auth, updateAccount)
app.get('/v1/documents/:documentId', auth, getDocument)
app.post('/v1/documents/', upload.single('test'), auth, uploadDocument)
app.delete('/v1/documents/:documentId', auth, deleteDocument)
app.get('/v1/documents/', auth, getAllDocuments)
app.get('/v1/verifyUserEmail/', verifyAccount)


}