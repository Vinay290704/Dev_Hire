const asyncHandler = require("express-async-handler");
const User = require("../../models/entities/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Registration User
// public access
// POST METHOD
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  // Check for missing fields
  if (!name || !username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // If already existing user with same email
  const userAlreadywithUsername = await User.findOne({
    where: {
      username: username,
    },
  });

  if (userAlreadywithUsername) {
    res.status(409);
    throw new Error("User already exists with username");
  }

  const userAlreadyExistswithEmail = await User.findOne({
    where: {
      email: email,
    },
  });

  if (userAlreadyExistswithEmail) {
    res.status(409);
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

    res.status(201).json({
      message: "User registred and logged in successfully",
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(500);
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
    res.status(400);
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

    res.status(200).json({
      message: "Logged In Successfully",
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid identifier or password.");
  }
});

module.exports = { registerUser, loginUser };
