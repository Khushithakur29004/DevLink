const express = require("express");
const connectDB = require("./config/Database");
const app = express();
const cookieparser = require("cookie-parser");
const cors=require("cors");
require('dotenv').config()



app.use(cors({
  origin: "http://localhost:5173", // React app
  credentials: true,               // allow cookies
}));


app.use(express.json());
app.use(cookieparser());

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)


connectDB()
  .then(() => {
    console.log("database connected successfully");
   app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("server is successfully listening on port 3000");
});


  })
  .catch((err) => {
    console.log("database cannot be connected");
  });
