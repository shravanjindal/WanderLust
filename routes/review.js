import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { Listing } from "../models/listing.model.js";
import { Review } from "../models/review.model.js";
import { isLoggedIn } from "../middleware.js";
import { validateReview } from "../middleware.js";
import { isReviewAuthor } from "../middleware.js";
const router = express.Router({mergeParams : true});

router.get("/",(req,res)=>{
    let id = req.params.id;
    res.redirect(`/listings/${id}`)
})
router.get("/:reviewId", (req,res)=>{
    let id = req.params.id;
    res.redirect(`/listings/${id}`)
})
router.post("/",isLoggedIn, validateReview, wrapAsync( async (req,res)=> {
    let id = req.params.id;
    let newReview = req.body.review;
    newReview.createdBy = req.user._id;
    let review = new Review(newReview);
    let listing = await Listing.findById(id);
    listing.reviews.push(review)
    await review.save()
    await listing.save()
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`)
}))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync (async (req,res)=>{
    let id = req.params.id;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`)
}))

export default router;