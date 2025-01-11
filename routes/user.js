import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import userController from "../controllers/users.js"
const router = express.Router();

// show route
router.get("/signup", userController.renderSignUp);

// create route
router.post("/signup", wrapAsync(userController.createUser));

// show route
router.get("/login", userController.renderLogin);

// authentication route
router.post("/login", saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login)

// logout route
router.get("/logout", userController.logout);

export default router;