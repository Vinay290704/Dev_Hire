const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  }
);
async function testSequelizeConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL via Sequelize");
  } catch (error) {
    console.error(
      "Unable to connect to the MYSQL database via Sequelize: ",
      error.message
    );
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  testSequelizeConnection,
};
