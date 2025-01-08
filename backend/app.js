import express, { urlencoded } from "express";
const app = express();
import mongoose from "mongoose";
import { Listing } from "./models/listing.model.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override"
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema } from "./schema.js";
import { Review } from "./models/review.model.js";
// Create __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")))
main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

app.get("/", (req,res)=>{
    res.send("Hi! I am root");
})

const validateListing = (req,res,next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}
// Index Route
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("index.ejs", {allListings});
}))

// new Route
app.get("/listings/new", (req,res)=>{
    res.render("new.ejs")
})

// create route
app.post("/listings", validateListing, wrapAsync( async (req,res,next)=>{
    let obj = req.body.listing;
    let url = obj.image;
    obj.image = {
        filename:"filename",
        url:url
    }
    const newListing = new Listing(obj);
    await newListing.save();
    res.redirect("/listings");
}))
// show Route
app.get("/listings/:id", wrapAsync(async (req, res,next)=> {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate('reviews');
    res.render("show.ejs", {listing});
}))
app.get("/listings/:id/edit", wrapAsync(async (req,res,next)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", {listing});
}))
app.put("/listings/:id", validateListing, wrapAsync(async (req,res,next)=>{
    let id = req.params.id;
    let obj = req.body.listing;
    // if (!obj) throw new ExpressError(400, "Send valid data for listing")
    let url = obj.image;
    obj.image = {
        filename:"filename",
        url:url
    }
    await Listing.findByIdAndUpdate(id, obj);
    res.redirect(`/listings/${id}`);
}))
app.post("/listings/:id/reviews", async (req,res)=> {
    let id = req.params.id;
    let review = new Review(req.body.review);
    let listing = await Listing.findById(id);
    listing.reviews.push(review)
    await review.save()
    await listing.save()
    res.redirect(`/listings/${id}`)
})
app.delete("/listings/:id", wrapAsync (async (req,res)=>{
    let id = req.params.id;
    await Listing .findByIdAndDelete(id);
    res.redirect("/listings");
}))
app.delete("/listings/:id/reviews/:reviewId", wrapAsync (async (req,res)=>{
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`)
}))
// middlewares
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {statusCode,message,err})
})
app.listen(3000, ()=>{
    console.log("server listening to port 3000")
})