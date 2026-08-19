const jwt=require("jsonwebtoken");

// global middleware
const authMiddleware=(req, res, next)=>{
const token=req.cookies?.token;
<<<<<<< HEAD
if(!token){ 
    //not logged in -reject user
=======
if(!token){
>>>>>>> 3888dbb (Resolved PR review comments)
     return res.status(401).json({
        message:"Authentication required"
    });
}

try{
const decodedData=jwt.verify(token, process.env.JWT_SECRET,{
    algorithms:["HS256"]
});

req.userId=decodedData.userId;
next(); //continue to protected controller
}
catch(error){
    //run for invlaid , expired, or unusable jwt
 return res.status(401).json({
      message: "Invalid or expired token",
    });
}
};
module.exports = authMiddleware;