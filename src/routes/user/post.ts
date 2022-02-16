import { Response, Request } from "express";

const userFavorite = require("../../db/index.js").userFavorite;

module.exports = async (req: Request, res: Response) => {
  const serviceId = req.query.serviceId || "";
  const userId = req.query.userId || "";
  const ans = await userFavorite(userId, serviceId);
  if(ans) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.send(200)
  }else{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.send(400)
  }
};
