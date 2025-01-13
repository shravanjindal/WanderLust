import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import { sampleListings } from "./data.js";
import { Listing } from "../models/listing.model.js";

const dbURL = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbURL);
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
    let data = sampleListings.map((obj)=>({
        ...obj, owner : "678402d9daf249fc876f16d8"
    }))
    await Listing.insertMany(data);
    console.log("data was initialized")
}

initDB();