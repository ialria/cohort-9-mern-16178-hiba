const prisma=require("../config/prisma");
const logger=require("../utilities/logger");
const getProfile=async (req, res)=>{
try{
const user=await prisma.user.findUnique({
    where:{
        id:req.userId,
    },
     select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
     }
});
  if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
}
catch(error){
logger.error({error},"Error fetching profile");

    return res.status(500).json({
      message: "Failed to fetch profile",
    });
}
};

module.exports = {
  getProfile,
};