const { constants } = require("../constants/constants");
const dotenv = require("dotenv").config();

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized Access",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden Access",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.CONFLICT:
      res.json({
        title: "Conflict",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
    default:
      res.json({
        title: "Unhandled Error",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
  }
};

module.exports = errorHandler;
