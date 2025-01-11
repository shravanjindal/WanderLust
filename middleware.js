import { Listing } from "./models/listing.model.js";
import { listingSchema } from "./schema.js";
import { reviewSchema } from "./schema.js";
import { Review } from "./models/review.model.js";
import ExpressError from "./utils/ExpressError.js";

export const isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be login first!")
        res.redirect("/login");
    }
    next();
}

export const saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

export const isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!req.user._id.equals(listing.owner._id)){
        req.flash("error", "You don't have permission to perform the operation!");
        return res.redirect(`/listings/${id}`)
    }
    next();
};
export const validateListing = (req,res,next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}
export const validateReview = (req,res,next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}
export const isReviewAuthor = async (req,res,next) =>{
    let reviewId = req.params.reviewId;
    let review = await Review.findById(reviewId);
    if (!review.createdBy._id.equals(req.user._id)){
        req.flash("error","You don't have permission to delete this review!");
        return res.redirect(`/listings/${id}`)
    }
    next()
}