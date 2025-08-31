const express =require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../model/User");
const bcrypt = require("bcrypt");

const authRouter= express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { password, ...rest } = req.body;

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating the new instance of user module with all fields
    const user = new User({
      ...rest,
      password: passwordHash,
    });

     const savedUser = await user.save();

     const token = await savedUser.getJWT();
    // add token to the cookies and send the response to the user
    res.cookie("token", token ,{
      expires: new Date(Date.now()+ 8 * 3600000)
    });
   
    res.json({message:"User Added Successfully!!", data: savedUser});
  } catch (err) {
    res.status(500).send("ERROR :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("user not found");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      
      const token = await user.getJWT();

      // add token to the cookies and send the response to the user

      res.cookie("token", token ,{expires: new Date(Date.now()+ 8 * 3600000)});

      res.send(user);
    } else {
      throw new Error("password is not valid");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    })
    res.send("logout succesfully!!!");
})

module.exports=authRouter;