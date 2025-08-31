const mongoose =require("mongoose");
const validator =require("validator")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema =new mongoose.Schema({
    firstName :{
        type :String,
        required:true,
    },
    lastName : {
        type : String,
    },
    emailId :{
        type : String,
        required:true,
        lowercase : true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is not valid" + value);
            }
        },
    },
    password :{  
        type: String,
        required:true,
         validate(value){
            if(!validator.isStrongPassword  (value)){
                throw new Error("enter a strong password" + value);
            }
        },
    },
    age:{
        type: Number,
        min:18,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender is not valid")
            }
        }
    },
    photoUrl:{
        type: String,
        dafault:"https://geographyandyou.com/images/user-profile.png",
         validate(value){
            if(!validator.isURL(value)){
                throw new Error(" Invalid photo URL" + value);
            }
        },
    },
    about:{
        type: String,
        default:"hello!! i'm using devTinder"
    },
    skills:{
        type: [String],
    },
},
{
    timestamps:true,
});


userSchema.methods.getJWT = async function(){
const user = this;

// create a jwt token      //hidding id   //secret key which only server   //expireing duration
                                                //  know not user not attacker
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$780" ,{expiresIn:"7d",});

      return token;
};

userSchema.methods.validatePassword= async function(passwordInputByUser){
    const user= this;
    const passwordHash =user.password;

    const isPasswordValid= await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;

};

module.exports=mongoose.model("User", userSchema); // to convert schema into model for future use and than exported