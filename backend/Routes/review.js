import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { Listing } from "../models/listing.model.js";
import { Review } from "../models/review.model.js";
import { reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";

const router = express.Router({mergeParams : true});

const validateReview = (req,res,next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

router.post("/", validateReview, wrapAsync( async (req,res)=> {
    let id = req.params.id;
    let review = new Review(req.body.review);
    let listing = await Listing.findById(id);
    listing.reviews.push(review)
    await review.save()
    await listing.save()
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`)
}))

router.delete("/:reviewId", wrapAsync (async (req,res)=>{
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`)
}))

export default router;