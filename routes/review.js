import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import { isLoggedIn } from "../middleware.js";
import { validateReview } from "../middleware.js";
import { isReviewAuthor } from "../middleware.js";
import reviewController from "../controllers/reviews.js"
const router = express.Router({mergeParams : true});

// show routes
router.get("/", reviewController.showListing);
router.get("/:reviewId", reviewController.showListing)

// create route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

// delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync (reviewController.destroyReview))

export default router;