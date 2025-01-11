import { Listing } from "../models/listing.model.js";

const controller = {
    index : async (req,res)=>{
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
    },
    renderNewForm  : (req,res)=>{
        res.render("listings/new.ejs")
    },
    createListing :  async (req,res,next)=>{
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
    },
    showListing : async (req, res,next)=> {
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
    },
    renderEditForm : async (req,res,next)=>{
        let id = req.params.id;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing doesn't exist");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", {listing});
    },
    updateListing : async (req,res,next)=>{
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
    },
    destroyListing : async (req,res)=>{
        let id = req.params.id;
        await Listing .findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!")
        res.redirect("/listings");
    }
}

export default controller;