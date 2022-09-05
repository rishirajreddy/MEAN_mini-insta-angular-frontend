const User = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.getAllUsers = async(req,res) => {
    User.find()
    .then((users) => {
        res.status(200).json({users:users})
    })
    .catch(err => console.log(err))
}

exports.registerUser = async(req,res) => {
    const {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        let token = jwt.sign({username:req.body.username},
            process.env.JWT_KEY,{
                expiresIn: "1h"
            }
            );
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })
        await user.save()
        .then((result) => {
            console.log("User Registered");
            res.status(200).json({
                status:"Success!!",
                username: req.body.username,
                msg:"Registered Successfully",
                profile: user.profile,
                token:token,
            })
        })
        .catch(err => {
            // console.log(err.message);
            if(err.code === 11000){
                res.status(500).json({msg:"User already exists!!"})
            }else {
                res.status(500).json({msg:err.message})
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}


exports.loginUser = async(req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    try {
        if(!user){
            return res.status(404).json({
                status:"Login Failed!!",
                msg:"User not found!!"
            })
        }   

        const isCorrect = await bcrypt.compare(password, user.password);
        if(isCorrect){
            let token = jwt.sign({username:req.body.username},
                process.env.JWT_KEY,{
                    expiresIn: "1h"
                }
                );
            res.status(200).json({
                status:"User found!!",
                username: req.body.username,
                msg:"Login Success",
                profile: user.profile,
                token:token,
                expiresIn: 3600
            })
            console.log("Login SUccess");
        }else {
            res.status(401).json({
                msg:"Incorrect email or password"});
            console.log("Login failed!!");
        }
    }
    catch(err) {
        res.status(500).json({msg:err.message})
        console.log(err.message);
    }
}


exports.sendMessage = async(req,res) => {
    const current_user = req.decoded.username;
    try {
        User.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $addToSet: {
                    messages:  {
                        username: req.decoded.username,
                        message: req.body.message
                    }
                }
            },
        (err, result) => {
            if(err) {
                console.log(err);
                res.status(500).json({msg: "Unable to send the message"})
            }else{ 
                // console.log(result);
                res.status(200).json({
                    msg:"Message to sent to user "+ result.username
                })
            }
        }
        )
    } catch (error) {
        console.log(error);        
    }
    
}