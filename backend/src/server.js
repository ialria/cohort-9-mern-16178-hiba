require("dotenv").config();

const requiredVariables = ["JWT_SECRET", "FRONTEND_URL", "DATABASE_URL"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is required`);
  }
}

const app = require("./app");

const app = require("./app");
const prisma = require("./config/prisma.js");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected.");

    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));