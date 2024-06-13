// db.js
const Sequelize = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.SQL_SERVER,
  port: process.env.SQL_PORT, // Default SQL Server port
  database: process.env.SQL_DB,
  username: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  ssl: isProduction ? true : false,
  dialectOptions: {
    ssl: isProduction
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
  },
});
module.exports = sequelize;
