const mongoose = require("mongoose");
const schema = mongoose.Schema;

// creating User schema
let userSchema = new schema({
  name: String,
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// model
let User = mongoose.model("User", userSchema);

module.exports = User;
