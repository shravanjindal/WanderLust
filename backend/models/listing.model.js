import mongoose from "mongoose";

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
    }
)

const Listing = mongoose.model("Listing", listingSchema)

export { Listing };