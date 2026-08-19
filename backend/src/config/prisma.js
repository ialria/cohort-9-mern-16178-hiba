require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE URL is not set");
}
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const databaseUrl = new URL(process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port) || 3306,
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database:decodeURIComponent(databaseUrl.pathname.slice(1)),
});
const prisma = new PrismaClient({ adapter });

module.exports = prisma;