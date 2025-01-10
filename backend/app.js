import express, { urlencoded } from "express";
const app = express();
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override"
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import listings from "./Routes/listing.js"
import reviews from "./Routes/review.js"

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// middlewares
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.render("error.ejs", {statusCode,message,err})
})

app.listen(3000, ()=>{
    console.log("server listening to port 3000")
})