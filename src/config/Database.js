const mongoose =require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://NamasteNode:PqVprWrF2xBV2iaH@namastenode.txanrey.mongodb.net/devTinder"
    );
};

module.exports = connectDB;

