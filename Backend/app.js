const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const {
  sequelize,
  testSequelizeConnection,
} = require("./config/database/sequelize");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

startserver();

async function startserver() {
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

app.use("/users", require("./routes/users/userRoute"));
app.use(errorHandler);
