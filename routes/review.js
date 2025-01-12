import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import { isLoggedIn } from "../middleware.js";
import { validateReview } from "../middleware.js";
import { isReviewAuthor } from "../middleware.js";
import reviewController from "../controllers/reviews.js"
const router = express.Router({mergeParams : true});

router
    .route("/")
    .get(reviewController.showListing)
    // create route
    .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview))
router
    .route("/:reviewId")
    .get(reviewController.showListing)
    // delete route
    .delete(isLoggedIn,isReviewAuthor, wrapAsync (reviewController.destroyReview))

export default router;