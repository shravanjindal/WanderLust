import express from "express";
import { User } from "../models/user.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
const router = express.Router();

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req,res,next)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err)=>{
            if (err) { return next() }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("failure", err.message);
        res.redirect("/signup");
    }
}))

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req,res)=>{
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);    
})

router.get("/logout", (req,res, next)=>{
    req.logout((err)=>{
        return next(err);
    })
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
})

export default router;