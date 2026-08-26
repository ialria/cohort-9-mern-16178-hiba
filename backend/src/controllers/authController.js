const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger=require("../utilities/logger");
const crypto = require("crypto");

const emailService = require("../services/emailService");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
   if (
  typeof username !== "string" ||
  typeof email !== "string" ||
  typeof password !== "string" ||
  !username.trim() ||
  !email.trim() ||
  !password.trim()
) {
  return res.status(400).json({
    message: "Username, email and password required",
  });
}

    if (password.length < 8) {
  return res.status(400).json({
    message: "Password must be at least 8 characters long",
  });
}
 if (password.length > 64) {
  return res.status(400).json({
    message: "Password must be 64 characters or less",
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email.trim())) {
  return res.status(400).json({
    message: "Please enter a valid email",
  });
}

//different casing or spaces donot create new/duplicated accounts
const normalizedEmail = email.trim().toLowerCase(); 
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
      data: {
        username: username,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Account created",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
     if (error.code === "P2002") {
    return res.status(409).json({
      message: "Email is already registered",
    });
  }
    logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
      },
    },
    "Signup failed"
  );
  return  res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    //hash the entered password and then we compare the hash
    const userPassword = await bcrypt.compare(password, user.password);
    if (!userPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    //jwt- contains id
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
        algorithm: "HS256",
    });

    // store in http only cookie -cannot access the token
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
});
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
      },
    },
    "Login failed"
  );
   return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const logout= (req, res)=>{
  //removing the cookie
   res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
  return res.status(200).json({
    message: "Logout successful",
  });
};

const forgotPassword=async (req, res)=>{
try{
    const {email}=req.body;
    if(!email){
        return res.status(400).json({
            message: "Email is required"
        });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const user=await prisma.user.findUnique({
        where:{email:normalizedEmail}
    });


    if(!user){
        return res.status(200).json({message:"If an account exists with this email, a reset link has been sent."});
    }

    const resetToken=crypto.randomBytes(32).toString("hex");
    const hashedToken=crypto.createHash("sha256").update(resetToken).digest("hex"); //token exists onl in reset link then 

    // valid for 15 minutes
    const tokenExpiresAt=new Date(Date.now()+ 15 * 60 * 1000);
    await prisma.$transaction([

  prisma.passwordresettoken.deleteMany({
        where:{
            userId:user.id
        }
    }),

         prisma.passwordresettoken.create({
        data:{
            hashedToken,
            tokenExpiresAt,
            userId:user.id
        }
    })
    ]);

   
    // placing unhashed token in link
const resetLink =  `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

try {
  await emailService.sendPasswordResetEmail(user.email, resetLink);

} catch (error) {
  await prisma.passwordresettoken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  throw error;
}

 return res.status(200).json({
      message: "If an account exists with this email, a reset link has been sent.",
    });
}catch (error){
     logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
      },
    },
    "Forgot password failed"
  );
    return res.status(500).json({
        message:"Something went wrong"
    });
}
};

const resetPassword=async (req, res)=>{
    try{
const {token, password}=req.body;
if (
  typeof token !== "string" ||
  typeof password !== "string" ||
  !token.trim() ||
  !password.trim()
) {
  return res.status(400).json({
    message: "Token and password are required",
  });
}
  if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    if (password.length > 64) {
      return res.status(400).json({
        message: "Password must be 64 characters or less",
      });
    }

  const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
       const resetToken = await prisma.passwordresettoken.findUnique({
      where: {
        hashedToken,
      },
    });
       if (!resetToken) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    // making sure that expired token cannot be used again
  if (resetToken.tokenExpiresAt < new Date()) {
      await prisma.passwordresettoken.delete({
        where: {
          id: resetToken.id,
        },
      });

      return res.status(400).json({
        message: "This reset link has expired",
      });
    }
 const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      }),

      prisma.passwordresettoken.delete({
        where: {
          id: resetToken.id,
        },
      }),
    ]);

    return res.status(200).json({
      message: "Password reset successfully",
    });
    }catch (error){
    logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
      },
    },
    "Password reset failed"
  );
 return res.status(500).json({
      message: "Something went wrong",
    });
    }
};


const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
        },
      },
      "Failed to fetch current user"
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser
};
