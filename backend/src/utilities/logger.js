const pino=require("pino");

const logger=pino({
    level: process.env.LOG_LEVEL || "info",
  redact: ["req.headers.cookie", "req.headers.authorization"],
//   have to protect jwt because token is stored in cookie
});
module.exports=logger;
