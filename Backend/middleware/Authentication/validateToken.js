const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { constants } = require("../../constants/constants");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader && !authHeader.startsWith("Bearer")) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Authorization token is missing or invalid.");
  }
  token = authHeader.split(" ")[1];

  if (!token) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Token is required");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(constants.UNAUTHORIZED);
      throw new Error("Access token expired. Please refresh or log in again.");
    } else if (err.name === "JsonWebTokenError") {
      res.status(constants.FORBIDDEN);
      throw new Error("Invalid access token.");
    } else {
      res.status(constants.SERVER_ERROR);
      throw new Error("Failed to validate token: " + err.message);
    }
  }
});


module.exports = validateToken