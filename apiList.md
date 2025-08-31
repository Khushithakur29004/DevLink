devTinder API

authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /profile
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter
-POST /request/send/:status/:userId ---> Here status is dynamic we make only one API for 2 status             
                                          (interested , ignored)
-POST /request/review/:status/:requestId----> here status is dynamic we make ne API for 2 status
                                              (accepted , rejected)

(status - ignore, interested, accepted, rejected)

userRouter
-GET /user/connection
-GET /user/requests/received
-GET /user/feed - get you the profiles of other user on platform