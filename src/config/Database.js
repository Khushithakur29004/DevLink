const mongoose =require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://NamasteNode:iYqyNwqZub5KICg4@namastenode.txanrey.mongodb.net/devTinder"
    );
};

module.exports = connectDB;

