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
import session from "express-session";
import flash from "connect-flash";

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

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, // for cross-scripting attacks
    }
}

app.get("/", (req,res)=>{
    res.send("Hi! I am root");
})


app.use(session(sessionOptions));
app.use(flash());

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    next();
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