const User = require("../models/user");
const Profile = require("../models/profile");
const _ = require("lodash");
const {updateProfile} = require("../utils/aws-helper");
const fs = require("fs");
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);


const bucket_region = "<<bucket_region>>";
const bucket_name = "<<bucket_name>>";

exports.createProfile = async(req,res) => {
    const user = await User.findOne({username: req.decoded.username});
    const email = user.get("email");

    const file = req.file;
    const imgResult = (await updateProfile(file)).promise();
    const url = req.protocol + "://" + req.get("host");
    
    imgResult.then((img) => {
        User.findOneAndUpdate({username: req.decoded.username},
            {
                $set: {
                    profile: {
                                username: req.decoded.username,
                                name:req.body.name,
                                email: email,
                                bio: req.body.bio,
                                dp: `https://${bucket_name}.s3.${bucket_region}.amazonaws.com/${img.Key}`
                                // dp: url + "/images/" + req.file.filename
                    }
                }
            },
            (err, result) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({msg:"Unable to create profile"})
                }else{ 
                    console.log(result);
                    res.status(200).json({msg:"Profile added"})
                }
            }
            )
    })

}

exports.getProfile = (req,res) => {
    User.findOne({username: req.decoded.username},(err,result) => {
        if(err) {
            console.log(err);
            res.json({
                msg:err.message
            })
        } 
        if(result === null){
            res.json({
                data:[]
            })
        }
        else {
            console.log(req.decoded.username);
            res.json({
                msg:"Success",
                data: result
            })
        }
    })
}

// exports.deleteProfile = async(req,res) => {
//     const profile = await Profile.findOne({username: req.decoded.username});
//     const user = await User.findOne({username: req.decoded.username});
//     // console.log(profile);
//     try{
//           Profile.remove(profile,user,(err,result) => {
//             if(err) res.json({msg:err})
//             res.status(200).json({msg: `Profile ${req.decoded.username} deleted succesffuly!!`})
//         })

//           User.remove(user,(err ,result) => {
//             if(err) req.json({msg:err})
//             return res.status(200).json({msg:`User ${req.decoded.username} deleted`})
//         })
//     }
//     catch(err) {
//         res.json({msg:err});
//         console.log(err);
//     };

// }

exports.updateProfile = async(req,res) => {
    
    let imagePath = req.body.image;
    // if(req.file){
    //     const url = req.protocol + "://" + req.get("host");
    //     imagePath = url + "/images/" + req.file.filename
    // }
    const file = req.file;
    const imgResult = (await updateProfile(file)).promise();
    imgResult.then((img) => {
        User.updateOne({username: req.decoded.username},
            {
                $set: {
                    "profile.username": req.decoded.username,
                    "profile.name": req.body.name,
                    "profile.bio": req.body.bio,
                    "profile.dp": `https://${bucket_name}.s3.${bucket_region}.amazonaws.com/${img.Key}`
                }
            }
            )
            .then((result) => {
                if(result.matchedCount > 0){
                    res.status(200).json({msg:"Updated!!"})
                }else {
                    res.status(500).json({msg:"Not authorized to update this post"})
                }
                console.log
            })
            .catch(err => {
                console.log(err.message);
                res.status(500).json({msg:"Couldn't update post"})
            })
    })
}

exports.getOthersProfile = async(req,res) => {
    User.findOne({username: req.params.username})
                    .then((profile) => {
                        if(!profile) {
                            console.log("Profile is not available");
                            res.status(404).json({msg:"Profile is not available for this user"})
                        }else {
                            res.status(200).json({msg:"Profile available", profile: profile})
                        }
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
}

// exports.getAllProfiles = async(req,res,next) => {
//     const profile = await Profile.find();
//     if(!profile){
//         res.status(404).json({
//             msg:"No Posts"
//         })
//     }
//     res.status(200).json({
//         body:{
//             data: profile
//         }
//     })
// }