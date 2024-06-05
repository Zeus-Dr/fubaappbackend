// db.js
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.SQL_SERVER,
  port: process.env.SQL_PORT, // Default SQL Server port
  database: process.env.SQL_DB,
  username: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true, // Force SSL
    },
  },
});
module.exports = sequelize;
