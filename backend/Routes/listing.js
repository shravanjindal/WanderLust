import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { Listing } from "../models/listing.model.js";
import { listingSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";

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
    res.render("index.ejs", {allListings});
}))

// new Route
router.get("/new", (req,res)=>{
    res.render("new.ejs")
})

// create route
router.post("/", validateListing, wrapAsync( async (req,res,next)=>{
    let obj = req.body.listing;
    let url = obj.image;
    obj.image = {
        filename:"filename",
        url:url
    }
    const newListing = new Listing(obj);
    await newListing.save();
    res.redirect("/listings");
}))
// show Route
router.get("/:id", wrapAsync(async (req, res,next)=> {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate('reviews');
    res.render("show.ejs", {listing});
}))
router.get("/:id/edit", wrapAsync(async (req,res,next)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", {listing});
}))
router.put("/:id", validateListing, wrapAsync(async (req,res,next)=>{
    let id = req.params.id;
    let obj = req.body.listing;
    // if (!obj) throw new ExpressError(400, "Send valid data for listing")
    let url = obj.image;
    obj.image = {
        filename:"filename",
        url:url
    }
    await Listing.findByIdAndUpdate(id, obj);
    res.redirect(`/listings/${id}`);
}))

router.delete("/:id", wrapAsync (async (req,res)=>{
    let id = req.params.id;
    await Listing .findByIdAndDelete(id);
    res.redirect("/listings");
}))


export default router;