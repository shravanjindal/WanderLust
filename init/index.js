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
    let data = sampleListings.map((obj)=>({
        ...obj, owner : "678144507e7179e541ee108a"
    }))
    await Listing.insertMany(data);
    console.log("data was initialized")
}

initDB();