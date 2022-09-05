const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const check_auth = require("../middlewares/check_auth");


//get all users
router.route("").get(authController.getAllUsers);

//registering user
router.route("/register").post(authController.registerUser);

//signing in user
router.route("/login").post(authController.loginUser);

// router.route("/:id").post(check_auth.checkToken,authController.sendMessage);
//updating user
// router.route("/update").patch(authController.updateUser);
module.exports = router;