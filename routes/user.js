import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import userController from "../controllers/users.js"
const router = express.Router();

router
    .route("/signup")
    .get(userController.renderSignUp)
    // create route
    .post(wrapAsync(userController.createUser));

router
    .route("/login")
    .get(userController.renderLogin)
    // authentication route
    .post(saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login)

// logout route
router
    .get("/logout", userController.logout);

export default router;