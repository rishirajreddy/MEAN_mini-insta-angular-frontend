const express = require("express");
const router = express.Router();
const check_auth  = require("../middlewares/check_auth");
const extractFile  = require("../middlewares/image_file");
const postController  = require("../controllers/postsController");

router.get(
    "/profile/posts/all",
    check_auth.checkToken,
    postController.getAllPosts
)

router.get(
    "/profile/posts",
    check_auth.checkToken,
    postController.getMyPosts
)

router.post(
    "/profile/newPost",
    extractFile,
    check_auth.checkToken,
    postController.createPost
    )

router.put(
    "/profile/posts/:id",
    extractFile,
    check_auth.checkToken,
    postController.updatePost
)

router.delete(
    "/profile/posts/:id",
    check_auth.checkToken,
    postController.deletePost
)

router.delete(
    "/profile",
    check_auth.checkToken,
    postController.deleteAllPosts
)

router.patch(
    "/likePost/:id",
    check_auth.checkToken,
    postController.addLikes
)

router.patch(
    "/comment/:id",
    check_auth.checkToken,
    postController.addComments
)

router.get(
    "/profile/posts/:id",
    check_auth.checkToken,
    postController.getPost
)

router.get(
    "/profile/post/:id",
    check_auth.checkToken,
    postController.getOthersPost
)

router.get(
    "/profile/others/posts/:username",
    check_auth.checkToken,
    postController.getOthersPosts
)

// router.get(
//     "/comments/:id",
//     check_auth.checkToken,
//     postController.deleteComment
// )

module.exports = router;