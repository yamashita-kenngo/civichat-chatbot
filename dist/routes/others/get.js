"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getQueryResult = require("../../db/index").getQueryResult;
module.exports = async (req, res) => {
    const resultId = req.query.resultId || "";
    const ans = await getQueryResult(resultId);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.json(ans);
};
//# sourceMappingURL=get.js.map