import { Response, Request } from "express";

const db = require("../../db/index");

module.exports = async (req: Request, res: Response) => {
  const serviceId = req.params.serviceId || "";
  const ans = await db.getServiceDetail(serviceId);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.json(ans);
  await db.updateUseCount(serviceId);
};
