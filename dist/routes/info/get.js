"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../../db/index");
module.exports = async (req, res) => {
    const serviceId = req.params.serviceId || "";
    const ans = await db.getServiceDetail(serviceId);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.json(ans);
    await db.updateUseCount(serviceId);
};
//# sourceMappingURL=get.js.map