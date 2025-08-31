const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../model/User");
const ConnectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();

// Get all the  pending connection requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    );

    res.json({
      message: "data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl age gender about skills",
      )
      .populate(
        "toUserId",
        "firstName lastName photoUrl age gender about skills",
      );

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send({ data });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // User should see all the cards except -->
    // ---> 0. himself
    // ---> 1. people who are already connected to him
    // ---> 2. ignored people
    // ---> 3. alredy sent connection request

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit >50? 50 : limit; //limit should not be more then 50
    const skip =(page -1)* limit;


    // find all the connection request that i have (sent or received)
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

     // find all the user that we want on our feed
     const users = await User.find({
       $and : [
        {_id: { $nin: Array.from(hideUserFromFeed)}},
        {_id: { $ne: loggedInUser._id}},
    ],
     }).select("firstName lastName photoUrl age gender about skills").skip(skip).limit(limit);

      res.json({data: users});
  } catch (err) {
    res.status(400).json({message : "ErRRO :" + err.message});
  }
});



module.exports = userRouter;
