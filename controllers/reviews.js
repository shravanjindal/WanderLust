import { Listing } from "../models/listing.model.js";
import { Review } from "../models/review.model.js";

const controller = {
    showListing : (req,res)=>{
        let id = req.params.id;
        res.redirect(`/listings/${id}`)
    },
    createReview :  async (req,res)=> {
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
    },
    destroyReview : async (req,res)=>{
        let id = req.params.id;
        let reviewId = req.params.reviewId;
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`)
    }
}
export default controller;