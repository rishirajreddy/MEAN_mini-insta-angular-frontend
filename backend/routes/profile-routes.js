const express = require("express");
const router = express.Router();
const check_auth = require("../middlewares/check_auth");
const profileController = require("../controllers/profileController"); 
const extractFile = require("../middlewares/image_file");

//add profile
router.post(
    "/profile",
    extractFile,
    check_auth.checkToken, 
    profileController.createProfile)

//get profile
router.get(
    "/profile",
    check_auth.checkToken, profileController.getProfile);
// //delete profile
// router.route("/profile/deleteProfile").delete(check_auth.checkToken, profileController.deleteProfile);

//update profile
router.put(
    "/profile",
    extractFile,
    check_auth.checkToken, 
    profileController.updateProfile);

//get others profiles
router.get(
    "/profile/profileId/:username",
    check_auth.checkToken,
    profileController.getOthersProfile);


module.exports = router;

