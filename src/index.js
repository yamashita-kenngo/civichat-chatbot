"use strict";
exports.__esModule = true;
var express_1 = require("express");
var line = require("@line/bot-sdk");
var PORT = Number(process.env.PORT) || 5000;
// Environemnt variables
require("dotenv").config();
if (!process.env.LINE_CHANNEL_SECRET) {
    throw new Error("Environment variable LINE_CHANNEL_SECRET is not set.");
}
if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
    throw new Error("Environment variable LINE_CHANNEL_ACCESS_TOKEN is not set. ");
}
var config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};
var app = express_1["default"]();
app.post("/line", line.middleware(config), function (req, res) {
    var linePost = require("./routes/line/post");
    linePost(req, res);
});
app.post("/user", function (req, res) {
    require("./routes/user/post");
});
app.get("/others", function (req, res) {
    require("./routes/others/get");
});
// Health
app.get("/", function (req, res) {
    res.send("Hello! Civichat for Atami is now working!");
});
app.listen(PORT);
console.log("Server running at " + PORT);
