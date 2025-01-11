import mongoose from "mongoose";
import { Review } from "./review.model.js";

const listingSchema = mongoose.Schema(
    {
        title: {
            type:String,
            required:true
        },
        description:String,
        image: {
            filename:String,
            url : {
                type:String,
                default: "https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75",
                set: (v) => v==="" ? "https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75" : v 
            }
        },
        price:Number,
        location:String,
        country:String,
        reviews : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Review"
            }
        ],
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    }
)
listingSchema.post("findOneAndDelete", async (listing)=>{
    if (listing.reviews.length)
        await Review.deleteMany({_id : {$in : listing.reviews}})
})
const Listing = mongoose.model("Listing", listingSchema)

export { Listing };