const express = require("express");
const router = express.Router();
const passport = require("passport")


//@desc Auth with Google
//@route GET /
router.get("/google", passport.authenticate("google", {scope: ["profile"]}));

//@desc Google with callback page
//@route GET /
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/"}), (req, res)=>{
    res.redirect("/dashboard");
});
//@desc Logout
//@route GET /logout
router.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
})


module.exports = router;