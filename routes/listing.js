import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middleware.js";
import { isOwner } from "../middleware.js";
import { validateListing } from "../middleware.js";
import listingController from "../controllers/listings.js";
const router = express.Router();

router
    .route("/")
    // Index Route
    .get(wrapAsync(listingController.index))
    // create route
    .post((req,res,next)=>{console.log(req.body.listing), next()},isLoggedIn,validateListing, wrapAsync(listingController.createListing))

// new Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router
    .route("/:id")
    // show Route
    .get(wrapAsync(listingController.showListing))
    // Update Route
    .put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
    // delete route
    .delete(isLoggedIn, isOwner,wrapAsync (listingController.destroyListing))


// edit show route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))

export default router;