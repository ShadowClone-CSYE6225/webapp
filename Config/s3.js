const AWS = require('aws-sdk');
 
const client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});
 
const s3 = {
    client: client,
    bucket_name: process.env.S3BUCKET || "mytestbucketpratiktalreja"
};
 
module.exports = s3;