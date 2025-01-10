import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { Listing } from "../models/listing.model.js";
import { listingSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import { isLoggedIn } from "../middleware.js";
const router = express.Router();

const validateListing = (req,res,next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

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
    const newListing = new Listing(obj);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}))
// show Route
router.get("/:id", wrapAsync(async (req, res,next)=> {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}))
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req,res,next)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}))
router.put("/:id", isLoggedIn,validateListing, wrapAsync(async (req,res,next)=>{
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

router.delete("/:id",isLoggedIn, wrapAsync (async (req,res)=>{
    let id = req.params.id;
    await Listing .findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}))


export default router;