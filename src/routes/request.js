const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/User");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    // colon mean dynamic in nature

    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
       return res.status(400).send({ message: "invalid status type :" + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send({ message: "user not found with this id" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId, status },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "connect request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);



requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{

  //validate the status
  //akshay=>elon
   //request id should be valid
  //loggedInId = toUserId
  //status = interested
 

try{
const loggedInUser=req.user;
const {status ,requestId}=req.params;

const allowedStatus=["accepted","rejected"];
if(!allowedStatus.includes(status)){
  return res.status(400).send({message:"status is invalid!!"});
}

const connectionRequest = await ConnectionRequest.findOne({
  _id : requestId,
  toUserId : loggedInUser,
  status : "interested",
});
if(!connectionRequest){
  return res.status(404).send({message:"connection request not found!!"})
}

connectionRequest.status =status;

const data = await connectionRequest.save();

res.send({message : "conneection request" +" "+ status, data});

}catch(err){
res.status(400).send("ERROR :" + err.message)
}
  
})

module.exports = requestRouter;
