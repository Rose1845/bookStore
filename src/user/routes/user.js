const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models/user");
require("dotenv").config();
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host:process.env.EMAIL_HOST,
  port:process.env.EMAIL_PORT,
  // pbahbuxqjslsjbsd
  secure: true,
  auth: {
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
  },
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (req.body === "") {
    res.send("enter all details pleease");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  };
  try {
    // check if user email exists if not create user
    const user1 = await User.find({ email: email });

    const user = await User.create(newUser);
    // if email already exists
    if (user.email === user1.email) {
      res.status(400).json({ message: "email already exists" });
    }
    

    const mailOptions = {
      from: "roseodhiambo@agriboost.co.ke",
      to: user.email,
      subject: "Welcome to our platform",
      text: "Congratulations on joining our platform",
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    });

    res.status(201).json({
      message: "register successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (req.body === "") {
    res.send("enter all details pleease");
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "invalid user" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(400).json({ message: "invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refresh_token = crypto.randomBytes(64).toString("hex");
    user.refresh_token = refresh_token;
    res.status(200).json({
      message: "user logged in successfully",
      token: token,
      refresh_token: refresh_token,
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/refresh-token", async (req, res) => {
  const { refresh_token } = req.body;
  if (req.body === "") {
    res.send("enter all details pleease");
  }
  try {
    const user = await User.find({ refresh_token: refresh_token });
    if (!user) {
      res.status(400).json({ message: "invalid user" });
    }
    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/logout", async (req, res) => {
  const { refresh_token } = req.body;
  if (req.body === "") {
    res.send("enter all details pleease");
  }
  try {
    const user = await User.find({ refresh_token: refresh_token });
    if (!user) {
      res.status(400).json({ message: "invalid user" });
    }
    user.refresh_token = null;
    res.status(200).json({
      message: "user logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
