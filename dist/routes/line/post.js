"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (req, res) => {
    Promise.all(req.body.events.map(require("./messageHandler"))).then((result) => res.json(result));
};
//# sourceMappingURL=post.js.map