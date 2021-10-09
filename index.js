console.clear();

const Client = require("./src/Structures/Client.js");

const config = require("./src/Data/config.json");

const client = new Client();

const mongoose = require("mongoose");

client.start(config.token);

console.log("Hi! I'm alive, let me get started");

mongoose
  .connect(config.mongooseConnectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to mongoose");
  })
  .catch((err) => {
    console.log(err);
  });
