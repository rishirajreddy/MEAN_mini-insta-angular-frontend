const { S3 } = require("aws-sdk");
const util = require('util');
const fs = require("fs");

const bucket_region = "<<region_name>>";
const bucket_name = "<<bucketname>>";
const access_key = "<<accessKey>>";
const secret_key = "<<secretKey>>";

const s3 = new S3({
    region: bucket_region,
    accessKeyId: access_key,
    secretAccessKey: secret_key
})

const uploadPost =  async (file) => {
    const fileStream =  fs.createReadStream(file.path);
    const uploadParams = {
        Bucket : "<<bucketname>>",
        Body : fileStream,
        Key : "infinity-gram/posts/"+file.filename,
        // ContentType: "image/webp"
    }
    // console.log(url);

    return s3.upload(uploadParams, (err, data) => {
        if(err) {
            console.log(err);
        }else{
            console.log("success");
            // res.status(200).json({msg:"Uploaded to AWS"})
        }
    })
}

const updateProfile =  async (file) => {
    const fileStream =  fs.createReadStream(file.path);
    const uploadParams = {
        Bucket : "<<bucketname>>",
        Body : fileStream,
        Key : "infinity-gram/profiles/"+file.filename,
        // ContentType: "image/webp"
    }
    // console.log(url);

    return s3.upload(uploadParams, (err, data) => {
        if(err) {
            console.log(err);
        }else{
            console.log("success");
            // res.status(200).json({msg:"Uploaded to AWS"})
        }
    })
}

module.exports = {uploadPost, updateProfile};
