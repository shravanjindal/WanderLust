import dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override"
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";

import session from "express-session";
import MongoStore from 'connect-mongo';
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "./models/user.model.js";

import listingRouter from "./routes/listing.js"
import reviewRouter from "./routes/review.js"
import userRouter from "./routes/user.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbURL = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbURL);
}

app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")))

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto: {
        secret: "mysupersecretcode"
    },
    touchAfter : 24 * 3600,
})
store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store : store,
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
    res.redirect("/signup");
    // res.send("Hi! I am root");
})


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

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