// db.js
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.SQL_SERVER,
  port: process.env.SQL_PORT, // Default SQL Server port
  database: process.env.SQL_DB,
  username: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  // dialectOptions: {
  //   options: {
  //     encrypt: true, // Use encryption for SQL Server
  //     trustedConnection: true,
  //     trustServerCertificate: true,
  //   },
  // },
});
module.exports = sequelize;
