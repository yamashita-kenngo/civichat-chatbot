import express from "express";

const line = require("@line/bot-sdk");
const PORT = Number(process.env.PORT) || 5000;

// Environemnt variables
require("dotenv").config();
if (!process.env.LINE_CHANNEL_SECRET) {
  throw new Error("Environment variable LINE_CHANNEL_SECRET is not set.");
}

if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
  throw new Error(
    "Environment variable LINE_CHANNEL_ACCESS_TOKEN is not set. "
  );
}

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();

app.post("/line", line.middleware(config), function (req, res) {
  const linePost = require("./routes/line/post");
  linePost(req, res);
});
app.post("/user", function (req, res) {
  require("./routes/user/post");
});

app.get("/others", function (req, res) {
  const others = require("./routes/others/get");
  others(req, res);
});

// Health
app.get("/", (req, res) => {
  res.send("Hello! Civichat-chatbot is now working!");
});

app.listen(PORT);
console.log(`Server running at ${PORT}`);
