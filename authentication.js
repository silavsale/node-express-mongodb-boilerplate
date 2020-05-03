const mongoose = require("mongoose");
const User = require("./schema/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    req.token = bearer[1];
    next();
  } else {
    res.status(403).json({
      message: "Token not available",
    });
  }
};

let register = (req, cb) => {
  mongoose.connect(
    config.DB_CONNECT,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) throw new Error(err);
      let hash_password;

      const salt = bcrypt.genSaltSync(Number(process.env.bcrypt_saltRounds));
      hash_password = bcrypt.hashSync(req.body.password, salt);
      let register_user = new User({
        name: req.body.name,
        userName: req.body.userName,
        password: hash_password,
      });
      let validateUnique = new Promise((resolve, reject) => {
        User.find({ name: req.body.name }, (err, docs) => {
          if (err) reject(err);
          if (docs.length > 0) return reject("User Already Exist");
          else resolve();
        });
      });
      validateUnique
        .then((resolve) => {
          register_user.save((err, doc) => {
            if (err) return cb(err, null);
            else return cb(null, doc);
          });
        })
        .catch((reject) => {
          if (typeof reject === "string") return cb(reject, null);
          else return cb(reject.message, null);
        });
    }
  );
};

let login = (req, res, cb) => {
  let validateLogin = new Promise((resolve, reject) => {
    mongoose.connect(
      config.DB_CONNECT,
      { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        User.find({ userName: req.body.userName }, (err, docs) => {
          if (err) reject(err);
          if (docs.length == 1) {
            bcrypt.compare(req.body.password, docs[0].password, function (
              err,
              result
            ) {
              if (result) return resolve(docs[0]);
              else return reject("Wrong Credentials");
            });
          } else reject("User not found Credentials");
        });
      }
    );
  });

  validateLogin
    .then((resolve) => {
      let user = {
        id: resolve.id,
        name: resolve.name,
        userName: resolve.userName,
      };
      let token = jwt.sign({ user }, config.jwt_secret, { expiresIn: 1000 });
      let refresh_token = jwt.sign({ user }, config.jwt_secret, {
        expiresIn: 120,
      });
      return cb(null, [token, refresh_token]);
    })
    .catch((reject) => {
      if (typeof reject === "string")
        return res.status(401).json({
          message: "Wrong Credentials",
        });
      else return cb(reject.message, null);
    });
};

module.exports = { verifyToken, register, login };
