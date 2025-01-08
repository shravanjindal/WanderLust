import mongoose from "mongoose";
import { Listing } from "./listing.model.js";
const reviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export const Review = mongoose.model("Review", reviewSchema);