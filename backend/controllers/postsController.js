const {Post} = require("../models/posts");
const {Comment}  = require("../models/posts");
const Profile  = require("../models/profile");
const User = require("../models/user");
const {format, compareDesc, parseISO} = require("date-fns");
const { formatInTimeZone } = require('date-fns-tz');
const {uploadPost} = require("../utils/aws-helper");
const fs = require("fs");
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const { S3 } = require("aws-sdk");

const _ = require("lodash");

const bucket_region = "<<bucke_region>>";
const bucket_name = "<<bucke_name>>";


exports.createPost =async(req,res) => {
    const url = req.protocol + "://" + req.get("host");
    const user = await User.findOne({username: req.decoded.username});
    const dp = user.get('profile.dp')
    let currenTime = Date.now();

    // const imageUrl = `https://${bucket_name}.s3.${bucket_region}.amazonaws.com/infinity-gram/posts/${req.file.filename}`;
    const file = req.file;
    const imgResult = (await uploadPost(file)).promise();
    imgResult.then((img) => {
        Post.findOne({username: req.decoded.username})
    .then((user) => {
        if(!user){
            //create new post with the username
            const newPost = new Post({
                username: req.decoded.username,
                posts: {
                    username: req.decoded.username,
                    dp:dp,
                    title: req.body.title,
                    caption: req.body.caption,
                    createdAt: formatInTimeZone(new Date(),'Asia/Kolkata' ,'yyyy-MM-dd HH:mm:ss'),
                    image: `https://${bucket_name}.s3.${bucket_region}.amazonaws.com/${img.Key}`
                    }
            });
            newPost.save()
            .then(() => {
                res.status(200).json({msg:"POst added successfully", date: currenTime})
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({msg:"Post not added"})
            })
        }else {
            // add to the existing username
            Post.updateOne(
                {username: req.decoded.username},
                {   
                    $addToSet: {
                        posts: {
                            username: req.decoded.username,
                            dp:dp,
                            title: req.body.title,
                            caption: req.body.caption,
                            createdAt: formatInTimeZone(new Date(),'Asia/Kolkata' ,'yyyy-MM-dd HH:mm:ss'),
                            image: `https://${bucket_name}.s3.${bucket_region}.amazonaws.com/${img.Key}`
                            // image: url + "/images/" + req.file.filename
                        }
                    }
                }
                )
                .then(() => {
                    res.status(200).json({msg:"Post added Successfully",date: currenTime})
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({msg:"Post not added"})
                })
        }
    })
        console.log(img.Key);
    })
    await unlinkFile(file.path);

    }

exports.updatePost = async(req,res,next) => {
    const post = await Post.findOne({username: req.decoded.username});
    const postId = post._id.toString();

    try{
        Post.findOne({username: req.decoded.username})
        .then((user) => {
            if(!user){
                res.status(404).json({msg:"This user has no posts or user don't exists"})
            }else {
                Post.findOneAndUpdate(
                    {_id: postId},
                    {$set: {"posts.$[element].title": req.body.title,
                            "posts.$[element].caption": req.body.caption,
                            "posts.$[element].updatedAt": formatInTimeZone(new Date(),'Asia/Kolkata' ,'yyyy-MM-dd HH:mm:ss')
                }},
                    {arrayFilters: [{"element._id": req.params.id}]},

                    (err, result) => {
                        if(err) {
                            console.log(err);
                            res.status(500).json({msg:"Unable to update the post"})
                        }else {
                            if(!result){
                                res.status(404).json({msg:"No posts available for this user"})
                            }else {
                                // console.log(result);
                                res.status(200).json({msg:"Post Updated SUccessfully"});
                            }
                        }
                    }
                )
            }
        })        
        
    }
    catch(err){
        console.log(err);
    }
    }

exports.deletePost = async(req,res, next) => {
    // const user_post = await Post.findOne({username: req.decoded.username});

    Post.findOneAndUpdate(
        {username: req.decoded.username},
        {$pull: {posts: {_id: req.params.id}}},
        {safe: true, multi: true},
        (err, data) => {
            if(err){
                console.log(err);
                res.status(500).json({msg:"Unable to delete post",
                                    err: err.message
            })
            }else {
                res.status(200).json({msg:"Post Deleted!!"})
            }
        }
    )
}

exports.deleteAllPosts = async(req,res, next) => {
    // const user_post = await Post.findOne({username: req.decoded.username});

    Post.deleteMany(
        {username: req.decoded.username},
        {safe: true, multi: true},
        (err, data) => {
            if(err){
                console.log(err);
                res.status(500).json({msg:"Unable to delete posts",
                                    err: err.message
            })
            }else {
                res.status(200).json({msg:"All Posts Deleted!!"})
            }
        }
    )
}

exports.addLikes = async(req,res) => {
    var profile = {};
    await User.findOne({username: req.decoded.username})
                    .then((prof) => {
                        if(!prof){
                            console.log("No user profile");
                        }else {
                            profile = prof.profile;
                        }
                    })
    const user = req.decoded.username;

    Post.findOne({"posts": {$elemMatch: {_id: req.params.id}}},
    (err, post) => {
        if(err){
            console.log(err);
            res.status(500).json({msg:"Invalid post id"})
        }else{ 
            if(!post) {
                console.log(post);
                res.status(404).json({msg:"No post found with the given id"})
            }else{ 
                for (const item of post.posts) {
                    console.log("Entered for loop");
                    if(item._id.toString() === req.params.id){
                        if(item.likedBy.find(({username}) => username === user)){
                            const index = item.likedBy.findIndex(x => x.username === user);
                            item.likedBy.splice(index, 1);
                            post.save()
                            .then(() => {
                                res.json({msg:"Post Disliked", body: item})
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({msg:err.message})
                            })
                        }else {
                            item.likedBy.push(profile);
                            post.save()
                            .then(() => {res.status(200).json({msg:"Post Liked", body: profile})})
                            .catch(err => {console.log(err); res.status(500).json({msg:err.message})})
                        }
                    }else {
                        console.log("No matching id found");
                    }
                }
            }
        }
    }
    )
}

exports.addComments = async(req,res) => {
    const user = await User.findOne({username: req.decoded.username});
    const username = user.get("username");
    var inserted = false;

    Post.findOne({"posts": {$elemMatch: {_id: req.params.id}}},
    (err, post) => {
        if(err){
            res.json({msg:"Invalid post id"})
        } else {
            if(!post){
                res.json({msg:"No post with the given post id"})
            }else {
                for (const item of post.posts) {
                    if(item._id.toString() === req.params.id){
                            const newComment = new Comment({
                                name:username,
                                comment: req.body.comment,
                                commentedAt:formatInTimeZone(new Date(),'Asia/Kolkata' ,'yyyy-MM-dd HH:mm:ss')
                            })
                            post.posts.comments+=1;
                            console.log(newComment);
                            item.commentedBy.push(newComment);
                            item.comments +=1;
                            post.save()
                            .then(() => {res.json({msg:"Comment Added"})})
                            .catch(err => {
                                console.log(err)
                            })
                        }
                    else {
                        console.log("No matching id");
                    }
                }
            }
        }
    }

    
    )
}


// get all posts of parrtcular username
exports.getAllPosts = async(req,res) => {
    let postsArr = [];
    await Post.find()
            .then((post) => {
                for (let i = 0; i < post.length; i++) {
                    postsArr.push(post[i]['posts'])
                }
                let sortedArr = postsArr.flat().sort((a, b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt)));
                res.status(200).json(sortedArr)
                console.log("Fetched");
            })
            .catch(err => {
                res.status(500).json(err)
                console.log(err);
            })
}

exports.getMyPosts = async(req,res) => {
    let postsArr = [];
    
    await Post.find({username: req.decoded.username})
            .then((post) => {
                for (let i = 0; i < post.length; i++) {
                    postsArr.push(post[i]['posts'])
                }
                let sortedArr = postsArr.flat().sort((a, b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt)));
                res.json(sortedArr)
                console.log("Fetched");
            })
}

exports.getPost = async(req,res) => {
}

exports.getOthersPost = async(req,res) => {
    Post.findOne({"posts": {$elemMatch: {_id: req.params.id}}})
        .then((posts) => {
            if(!posts) {
                res.status(404).json({msg:"No posts found!!"});
            }else {
                for (const post of posts.posts) {
                    if(post._id.toString() === req.params.id){
                        res.status(200).json(post);
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOthersPosts = async(req,res) => {
    Post.findOne({username:req.params.username})
        .then((posts) => {
            if(!posts) {
                res.status(404).json({msg:"No Posts available"})
            }else {
                console.log("Fetched");
                res.status(200).json(posts.posts)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg:err.message});
        })
}

// exports.deleteComment = async(req,res) => {
//     Post.findOne(
//         {username: req.decoded.username, _id: }

//     )
// }
//Get Others Blog POsts
// exports.getOthersPosts = (req, res,next) => {
//     Post.find({username: {$ne :req.decoded.username}},(err,result) => {
//         if(err) res.json({msg:err})
//         if(result == null) res.json({data:[]})
//         else {
//             res.json({
//                 status:"Success",
//                 body:{
//                     result
//                 }
//             })
//         }
//     }
//     )
// }


//Delete post
// exports.deletePost =(req,res,next) => {
//     Post.findOneAndDelete(
//     {
//         $and:[{username: req.decoded.username}, {_id: req.params.id}],
//     },
//     (err,result) => {
//         if(err) res.json({msg:err});
//         else if(result){
//         console.log(result);
//         return res.json({msg:"POst Deleted!!"})
//         }
//         return res.json({msg:"Post Not Deleted"})
//     })
// }

//Update post




