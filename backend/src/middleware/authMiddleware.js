const jwt=require("jsonwebtoken");

const authMiddleware=(req, res, next)=>{
const token=req.cookies.token;
if(!token){
     return res.status(401).json({
        message:"Authentication required"
    });
}
try{
const decodedData=jwt.verify(token, process.env.JWT_SECRET);
req.userId=decodedData.userId;
next();
}
catch(error){
 return res.status(401).json({
      message: "Invalid or expired token",
    });
}
};
module.exports = authMiddleware;