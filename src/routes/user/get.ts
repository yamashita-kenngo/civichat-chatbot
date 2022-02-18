import { Response, Request } from "express";

const getUserFavorite = require("../../db/index.js").getUserFavorite;

module.exports = async (req: Request, res: Response) => {
  const userId = req.query.userId || "";
  const ans = await getUserFavorite(userId);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.json(ans);
};
