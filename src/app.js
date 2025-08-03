const express =require("express");

const app=express();



app.use("/hello",(req,res)=>{
    res.send("hello khushiiiiiiiiiiiiiiiii");
})

app.use("/test",(req,res)=>{
    res.send("hello conradeee");
})

app.listen(3000,()=>{
console.log("server is successfully listening");
});
