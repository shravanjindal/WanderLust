import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middleware.js";
import { isOwner } from "../middleware.js";
import { validateListing } from "../middleware.js";
import listingController from "../controllers/listings.js";
const router = express.Router();

// Index Route
router.get("/", wrapAsync(listingController.index))

// new Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

// create route
router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing))

// show Route
router.get("/:id", wrapAsync(listingController.showListing))

// editshow route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))

// Update Route
router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))

// delete route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync (listingController.destroyListing))


export default router;