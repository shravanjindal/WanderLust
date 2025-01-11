import { User } from "../models/user.model.js"
const controller = {
    renderSignUp : (req,res)=>{
        res.render("users/signup.ejs")
    },
    createUser : async (req,res,next)=>{
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
    },
    renderLogin : (req,res)=>{
        res.render("users/login.ejs");
    },
    login : async (req,res)=>{
        req.flash("success", "Welcome back to WanderLust");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);    
    },
    logout : (req,res, next)=>{
        req.logout((err)=>{
            return next(err);
        })
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    }
}
export default controller;