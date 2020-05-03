const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken"); // json web token
const { verifyToken, register, login } = require("./authentication"); // controller part

route.get("/", (req, res) => {
  res.json({
    message: "welcome to API",
  });
});

route.post("/register", (req, res) => {
  register(req, (error, doc) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
      });
    } else {
      console.log(doc);

      return res.status(200).json({
        message: "registered successfully",
      });
    }
  });
});

route.post("/login", (req, res) => {
  login(req, res, (err, tokenList) => {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      return res.status(200).json({
        token: tokenList[0],
        refresh_token: tokenList[1],
        message: "Login successful to API",
      });
    }
  });
});

route.get("/post", verifyToken, (req, res) => {
  jwt.verify(req.token, config.jwt_secret, (err, authData) => {
    if (err)
      return res.status(401).json({
        message: "Token Expired",
      });
    else {
      res.json({
        authData: authData,
        message: "Login successful to API",
      });
    }
  });
});

module.exports = route;
