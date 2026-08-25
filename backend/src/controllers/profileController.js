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
if (typeof username !== "string" || !username.trim()) {
  return res.status(400).json({
    message: "Username is required!",
  });
}

if (bio !== undefined && bio !== null && typeof bio !== "string") {
  return res.status(400).json({
    message: "Bio must be a string.",
  });
}
 if (avatarUrl !== undefined && avatarUrl !== null) {
      if (
        typeof avatarUrl !== "string" ||
        !/^data:image\/(jpeg|png);base64,/.test(avatarUrl)
      ) {
        return res.status(400).json({
          message: "Only JPG and PNG images are allowed.",
        });
      }

      const base64Data = avatarUrl.split(",")[1];

      if (!base64Data) {
        return res.status(400).json({
          message: "Invalid image data.",
        });
      }

      const imageSize = Buffer.from(base64Data, "base64").length;

      if (imageSize > 2 * 1024 * 1024) {
        return res.status(400).json({
          message: "Image must be smaller than 2MB.",
        });
      }
    }
    const updateData = {
      username: username.trim(),
      bio: bio?.trim() || null,
    };

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }
    const updateUser = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data:updateData,
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

 logger.error({ error:{
    name:error.name, message:error.message
 } }, "Error updating profile");

    return res.status(500).json({
      message: "Error! Failed to update profile",
    })
    }
};

module.exports = {
  getProfile, updateProfile
};