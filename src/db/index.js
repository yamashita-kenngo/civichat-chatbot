"use strict";
// DB操作まわりの関数をまとめて提供します
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// TODO: //とりあえずpg直で叩いてるけどPrismaとかORM入れたい
var Client = require("pg").Client;
var uuidv4 = require('uuid').v4;
require("dotenv").config();
if (!process.env.RDS_HOSTNAME) {
    throw new Error("Environment variable RDS_HOSTNAME is not set.");
}
if (!process.env.RDS_PORT) {
    throw new Error("Environment variable RDS_PORT is not set.");
}
if (!process.env.RDS_DB_NAME) {
    throw new Error("Environment variable RDS_DB_NAME is not set.");
}
if (!process.env.RDS_USERNAME) {
    throw new Error("Environment variable RDS_USERNAME is not set.");
}
if (!process.env.RDS_PASSWORD) {
    throw new Error("Environment variable RDS_PASSWORD is not set.");
}
if (!process.env.LIFF_URL) {
    throw new Error("Environment variable LIFF_URL is not set.");
}
var liffUrl = process.env.LIFF_URL;
var pgConfig = {
    user: process.env.RDS_USERNAME,
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    ssl: { rejectUnauthorized: false }
};
console.log(pgConfig);
var pg = new Client(pgConfig);
pg.connect()
    .then(function () { return console.log("pg Connected successfuly"); })["catch"](function (e) { return console.log("pr err\n" + e); });
exports.getServiceDetail = function (serviceId) { return __awaiter(void 0, void 0, void 0, function () {
    var tableName, res, seidoType, img_url, service;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tableName = serviceId.split("-")[0];
                return [4 /*yield*/, pg.query({
                        text: "SELECT * FROM " + tableName + " WHERE service_id=$1;",
                        values: [String(serviceId)]
                    })];
            case 1:
                res = _a.sent();
                if (res.rows.length < 1) {
                    throw new Error("Not found");
                }
                seidoType = serviceId.split("-")[0];
                img_url = getImageUrl(seidoType);
                service = res.rows[0];
                return [2 /*return*/, __assign(__assign({}, service), { image_url: img_url, uri: liffUrl + "/info/" + serviceId })];
        }
    });
}); };
exports.saveUser = function (lineId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg.query({
                    text: "INSERT INTO users(line_id,created_at) VALUES ($1,current_timestamp);",
                    values: [lineId]
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.isLoggedIn = function (lineId) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg.query({
                    text: "SELECT user_id FROM users WHERE line_id=$1",
                    values: [lineId]
                })];
            case 1:
                res = _a.sent();
                if (res.rows.length < 1) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
exports.queryServices = function (systemIds, lineId, seido) { return __awaiter(void 0, void 0, void 0, function () {
    var resultId, resultSaveData, othersType, imgUrl, _i, systemIds_1, systemId, res, saveString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resultId = uuidv4();
                resultSaveData = {
                    result: [],
                    resultId: resultId
                };
                if (seido === "shibuya_preschool") {
                    othersType = "施設";
                }
                else if (seido === "shibuya_parenting" || seido === "kumamoto_earthquake" || seido === "japan") {
                    othersType = "制度";
                }
                else {
                    othersType = "";
                }
                if (seido === "shibuya_parenting" || seido === "shibuya_preschool") {
                    imgUrl =
                        "https://static.civichat.jp/thumbnail-image/babycar_woman_color.png";
                }
                else {
                    imgUrl = "https://static.civichat.jp/thumbnail-image/savings.png";
                }
                _i = 0, systemIds_1 = systemIds;
                _a.label = 1;
            case 1:
                if (!(_i < systemIds_1.length)) return [3 /*break*/, 4];
                systemId = systemIds_1[_i];
                return [4 /*yield*/, pg.query({
                        text: "SELECT * FROM " + seido + " WHERE service_id=$1;",
                        values: [String(systemId)]
                    })];
            case 2:
                res = _a.sent();
                //検索結果を配列に格納
                resultSaveData.result.push(__assign(__assign({}, res.rows[0]), { othersType: othersType }));
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                saveString = JSON.stringify(resultSaveData);
                //保存する
                return [4 /*yield*/, pg.query({
                        text: "INSERT INTO  results(result_id,result_body,line_id,src_table,created_at) VALUES ($1,$2,$3,$4,current_timestamp)",
                        values: [resultId, saveString, lineId, seido]
                    })];
            case 5:
                //保存する
                _a.sent();
                return [2 /*return*/, [resultId, othersType, imgUrl]];
        }
    });
}); };
exports.getQueryResult = function (resultId) { return __awaiter(void 0, void 0, void 0, function () {
    var res, seidoType, img_url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg.query({
                    text: "SELECT * FROM results WHERE result_id=$1;",
                    values: [String(resultId)]
                })];
            case 1:
                res = _a.sent();
                seidoType = JSON.parse(res.rows[0].result_body).result[0].service_id.split("-")[0];
                img_url = getImageUrl(seidoType);
                if (res.rows.length === 1) {
                    return [2 /*return*/, {
                            result: JSON.parse(res.rows[0].result_body).result,
                            img_url: img_url
                        }];
                }
                else {
                    return [2 /*return*/, { result: [] }];
                }
                return [2 /*return*/];
        }
    });
}); };
// systemsdata.jsonから制度詳細をDBに追加する関数
exports.saveInitialDatafromJson = function () { return __awaiter(void 0, void 0, void 0, function () {
    var systemsDataJapan, _i, _a, item;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                systemsDataJapan = require("../../static_data/japan/systemsdata.json");
                _i = 0, _a = systemsDataJapan.systemsData;
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                item = _a[_i];
                return [4 /*yield*/, pg.query({
                        text: "INSERT INTO japan (service_id,service_number,origin_id,alteration_flag,provider,prefecture_id,city_id,name,abstract,provisions,target,how_to_apply,application_start_date,application_close_date,contact,information_release_date,tags,theme,category,person_type,entity_type,keyword_type,issue_type,detail_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) ;",
                        values: [
                            item["サービスID"],
                            item["制度番号"],
                            item["元制度番号"],
                            item["制度変更区分"],
                            item["制度所管組織"],
                            item["都道府県"],
                            item["市町村"],
                            item["タイトル（制度名）"],
                            item["概要"],
                            item["支援内容"],
                            item["対象者"],
                            item["利用・申請方法"],
                            item["受付開始日"],
                            item["受付終了日"],
                            item["お問い合わせ先"],
                            item["公開日"],
                            item["タグ"],
                            item["テーマ"],
                            item["タグ（カテゴリー）"],
                            item["タグ（事業者分類）"],
                            item["タグ（事業者分類）"],
                            item["タグ（キーワード）"],
                            item["タグ（テーマ）"],
                            item["詳細参照先"]
                        ]
                    })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, "ok"];
        }
    });
}); };
function getImageUrl(seidoType) {
    var img_url;
    if (seidoType === "shibuya_preschool" || seidoType === "shibuya_parenting") {
        img_url =
            "https://static.civichat.jp/thumbnail-image/babycar_man_color.png";
    }
    else if (seidoType === "kumamoto_earthquake") {
        img_url = "https://static.civichat.jp/thumbnail-image/support.png";
    }
    else {
        img_url = "https://static.civichat.jp/thumbnail-image/support.png";
    }
    return img_url;
}
