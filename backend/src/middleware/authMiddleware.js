const jwt=require("jsonwebtoken");

// global middleware
const authMiddleware=(req, res, next)=>{
const token=req.cookies?.token;
if(!token){ 
    //not logged in -reject user
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