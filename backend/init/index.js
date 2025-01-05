import mongoose from "mongoose";
import { sampleListings } from "./data.js";
import { Listing } from "../models/listing.model.js";

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("data was initialized")
}

initDB();