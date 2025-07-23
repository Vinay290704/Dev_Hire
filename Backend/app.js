const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const {
  sequelize,
  testSequelizeConnection,
} = require("./config/database/sequelize");
const cors = require("cors");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

startServer();

async function startServer() {
  try {
    await testSequelizeConnection();

    await sequelize.sync();

    console.log("MySQL models synced successfully!");

    app.listen(port, () => {
      console.log(`Server is running on PORT: ${port}`);
    });
  } catch (err) {
    console.error("Failed to start the server: ", err.message);
    process.exit(1);
  }
}

app.use("/api/users/auth", require("./routes/users/userRoute"));

app.use(errorHandler);
