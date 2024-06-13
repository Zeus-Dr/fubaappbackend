const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "development";
const envFile = env === "development" ? ".env.local" : ".env";

dotenv.config({ path: path.resolve(__dirname, envFile) });

const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./db");

//routes
const userRoutes = require("./routes/user");

//express app
const app = express();

//using cors
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow only specified HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only specified headers
  })
);

// register global middleware
app.use(express.json()); //Any request that comes looks like it has somebody
// app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//route handler
app.use("/api/users", userRoutes);

//Connect to db here
// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      "Running in",
      process.env.NODE_ENV,
      "mode,",
      "connected to db & listening on port",
      process.env.PORT
    );
  });
});
