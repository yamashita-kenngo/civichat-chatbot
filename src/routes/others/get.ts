import { Response, Request } from "express";

const getQueryResult = require("../../db/index.js").getQueryResult;

module.exports = async (req: Request, res: Response) => {
  const resultId = req.query.resultId || "";
  const ans = await getQueryResult(resultId);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.json(ans);
};
