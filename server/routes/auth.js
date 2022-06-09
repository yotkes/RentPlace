const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const { NODEMAILER } = require("../keys");
const requireLogin = require("../middleware/requireLogin");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const { initRecommendations } = require("./init");
const { initRenterScore } = require("./init");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: NODEMAILER,
    },
  })
);

router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello user");
});

/**
 * signup
 * get user data, ensure there is an email, pass, name
 * check if the user already exist if not then create a new user.
 */
router.post("/signup", (req, res) => {
  const { name, email, password, photo, phone, interests } = req.body;
  if (!email || !password || !name || !interests) {
    return res.status(422).json({ error: "Please fill in all details" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Email address already exists" });
    }
    bcrypt.hash(password, 12).then((hashedpassword) => {
      const user = new User({
        name,
        email,
        password: hashedpassword,
        photo,
        phone,
        interests,
        cart: [],
        renterScore: 0,
        totalRents: 0,
        numOfProducts: 0,
      });
      user
        .save()
        .then((user) => {
          var userId = user._id;
          // Initializes the user's recommendations
          initRecommendations(userId);
          initRenterScore(userId);
          res.json({ message: "User created successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter email and password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Wrong email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, photo, phone, interests, renterScore } =
            savedUser;
          res.json({
            token,
            user: { _id, name, email, photo, phone, interests, renterScore },
          });
        } else {
          return res.status(422).json({ error: "Wrong email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "User does not exist" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "yotkes1@gmail.com",
          subject: "RentPlace - Reset Password",
          html: `
                   <p>
                   You have asked to reset your password
                   <h5><a href="http://localhost:3000/reset/${token}">Reset Password</a>Press the following link to reset your password</h5>
                   Regards,
                    <img style="width:100px" src="https://res.cloudinary.com/dxgyy6a6u/image/upload/v1654620551/logo_dn5ckt.png" alt="_blank" >
                    </img>
                   </p>
                   `,
        });
        res.json({
          message: "An email has been sent to you to reset your password",
        });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Expired - try again" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "Updated password successfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
