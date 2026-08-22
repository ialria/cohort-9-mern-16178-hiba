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

const updateProfile=async (req, res)=>{
    try{
const {username, bio, avatarUrl}=req.body;
if(!username || !username.trim()){
    return res.status(400).json({
        message:"Usesrname is required!"
    });
}
    const updateUser = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        username: username.trim(),
        bio: bio?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    return res.status(200).json(updateUser);
    }catch (error){
          console.error("UPDATE PROFILE ERROR:", error);

 logger.error({ error }, "Error updating profile");

    return res.status(500).json({
      message: "Error! Failed to update profile",
    })
    }
};

module.exports = {
  getProfile, updateProfile
};