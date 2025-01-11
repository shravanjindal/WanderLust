import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { Listing } from "../models/listing.model.js";

import { isLoggedIn } from "../middleware.js";
import { isOwner } from "../middleware.js";
import { validateListing } from "../middleware.js";
const router = express.Router();



// Index Route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}))

// new Route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs")
})

// create route
router.post("/", isLoggedIn,validateListing, wrapAsync( async (req,res,next)=>{
    let obj = req.body.listing;
    let url = obj.image;
    obj.image = {
        filename:"filename",
        url:url
    }
    obj.owner = req.user._id;
    const newListing = new Listing(obj);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}))
// show Route
router.get("/:id", wrapAsync(async (req, res,next)=> {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate('reviews').populate("owner").populate({
        path: "reviews",
        populate : {
            path : "createdBy",
            model: "User"
        }
    });
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing,currUser : res.locals.currUser});
}))
// editshow route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req,res,next)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}))
// Update Route
router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(async (req,res,next)=>{
    let id = req.params.id;
    let obj = req.body.listing;
    // if (!obj) throw new ExpressError(400, "Send valid data for listing")
    let url = obj.image;
    obj.image = {
        filename:"filename",
        url:url
    }
    await Listing.findByIdAndUpdate(id, obj);
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
}))
// delete route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync (async (req,res)=>{
    let id = req.params.id;
    await Listing .findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}))


export default router;