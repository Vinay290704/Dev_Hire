const asyncHandler = require("express-async-handler");
const User = require("../../models/entities/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { constants } = require("../../constants/constants");
require("dotenv").config();

// Registration User
// public access
// POST METHOD
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  // Check for missing fields
  if (!name || !username || !email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are required");
  }

  // If already existing user with same email
  const userAlreadywithUsername = await User.findOne({
    where: {
      username: username,
    },
  });

  if (userAlreadywithUsername) {
    res.status(constants.CONFLICT);
    throw new Error("User already exists with username");
  }

  const userAlreadyExistswithEmail = await User.findOne({
    where: {
      email: email,
    },
  });

  if (userAlreadyExistswithEmail) {
    res.status(constants.CONFLICT);
    throw new Error("User already exists with email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    email,
    name,
  });

  if (newUser) {
    // AccessToken
    const accessToken = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // RefreshToken
    const refreshToken = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(constants.CREATED).json({
      message: "User registred and logged in successfully",
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(constants.SERVER_ERROR);
    throw new Error("Server Error");
  }
});

function isEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("username or email and password are required.");
  }
  let user;
  if (isEmail(identifier)) {
    user = await User.findOne({
      where: {
        email: identifier,
      },
    });
  } else {
    user = await User.findOne({
      where: {
        username: identifier,
      },
    });
  }

  if (user && bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;

    await user.save();

    res.status(constants.OK).json({
      message: "Logged In Successfully",
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Invalid identifier or password.");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Refresh Token not provided in request body");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({
      where: {
        id: decoded.id,
        refreshToken: refreshToken,
      },
    });

    if (!user) {
      res.status(constants.FORBIDDEN);
      throw new Error("Invalid or revoked refresh token");
    }

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(constants.OK).json({
      message: "Tokens refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(constants.UNAUTHORIZED);
      throw new Error("Refresh Token Expired! Please login again");
    } else if (err.name === "JsonWebTokenError") {
      res.status(constants.FORBIDDEN);
      throw new Error("Invalid refresh token signature");
    } else {
      res.status(constants.SERVER_ERROR);
      throw new Error("Failed to refresh token : ", err.message);
    }
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("User not authenticated for logout.");
  }

  try {
    const user = await User.findByPk(userId);

    console.log("Found user")

    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error("User not found");
    }

    user.refreshToken = null;

    await user.save();

    res.status(constants.OK).json({
      message: "User logged out successfully",
    });
  } catch (err) {
    res.status(constants.SERVER_ERROR);
    throw new Error("Failed to logout: " + err.message);
  }
});
module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };
