require("dotenv").config();
const logger = require("./utilities/logger");
const requiredEnv = ["JWT_SECRET", "FRONTEND_URL", "DATABASE_URL"];

const requiredVariables = ["JWT_SECRET", "FRONTEND_URL", "DATABASE_URL"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is required`);
  }
}

const app = require("./app");
const prisma = require("./config/prisma.js");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
server.on("error", async (error) => {
  if (error.code === "EADDRINUSE") {
    logger.error(`Port ${PORT} is already in use`);
  } else {
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
          code: error.code,
        },
      },
      "Server failed to start",
    );
  }
  await prisma.$disconnect();
  process.exit(1);
});

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info("Prisma disconnected.");

      process.exit(0);
    } catch (error) {
      logger.error({ error }, "Prisma disconnect failed");
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
