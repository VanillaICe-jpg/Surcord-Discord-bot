const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  nameTag: {
    type: String,
    require: true,
    unique: true,
  },
  userID: {
    type: String,
  },
  serverID: {
    type: String,
    requiere: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  wins: {
    type: Number,
    default: 0,
  },
  defeats: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 5,
  },
});

const model = mongoose.model("profileModels", profileSchema);

module.exports = model;
