"use strict";
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
// DB操作まわりの関数をまとめて提供します
// TODO: //とりあえずpg直で叩いてるけどPrismaとかORM入れたい
var Client = require("pg").Client;
var uuid = require("uuidv4").uuid;
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
    port: process.env.RDS_PORT
};
console.log(pgConfig);
var pg = new Client(pgConfig);
pg.connect()
    .then(function () { return console.log("pg Connected successfuly"); })["catch"](function () { return console.log("err"); });
exports.getServiceDetail = function (serviceId) { return __awaiter(void 0, void 0, void 0, function () {
    var res, service;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg.query({
                    text: "SELECT * FROM users WHERE service_id=$1;",
                    values: [String(serviceId)]
                })];
            case 1:
                res = _a.sent();
                if (res.rows.length < 1) {
                    throw new Error("Not found");
                }
                service = res.rows[0];
                return [2 /*return*/, {
                        serviceId: service.service_id,
                        title: service.service_title,
                        subtitle: service.subtitle,
                        detailUrl: service.detail_url,
                        applyUrl: service.apply_url,
                        overview: service.overview,
                        administrativeServiceCategory: service.administrative_service_category,
                        organization: service.organization,
                        area: service.area,
                        target: service.target,
                        image_url: "https://static.civichat.jp/thumbnail-image/deferment.png",
                        priority: service.priority,
                        supportContent: service.service_content,
                        uri: liffUrl + "/info/" + serviceId,
                        lastUpdated: service.last_updated_at,
                        qualification: service.qualification,
                        acceptableDates: service.acceptable_dates,
                        acceptableTimes: service.acceptable_times,
                        needs: service.needs,
                        howToUse: service.howToUse
                    }];
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
    var resultId, resultSaveData, _i, systemIds_1, systemId, res, saveString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resultId = uuid();
                resultSaveData = {
                    result: [],
                    resultId: resultId
                };
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
                resultSaveData.result.push({
                    title: res.rows[0].name,
                    overview: res.rows[0].content_abstract,
                    detailUrl: res.rows[0].content_url
                });
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                saveString = JSON.stringify(resultSaveData);
                //保存する
                return [4 /*yield*/, pg.query({
                        text: "INSERT INTO  results(result_id,result_body,line_id,created_at) VALUES ($1,$2,$3,current_timestamp)",
                        values: [resultId, saveString, lineId]
                    })];
            case 5:
                //保存する
                _a.sent();
                return [2 /*return*/, resultId];
        }
    });
}); };
exports.getQueryResult = function (resultId) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pg.query({
                    text: "SELECT * FROM results WHERE result_id=$1;",
                    values: [String(resultId)]
                })];
            case 1:
                res = _a.sent();
                if (res.rows.length === 1) {
                    return [2 /*return*/, JSON.parse(res.rows[0].result_body)];
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
    var systemsData, _i, _a, item, date, systemsDataKumamoto, _b, _c, item, date;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                systemsData = require("../datas/shibuya/systemsdata.json");
                _i = 0, _a = systemsData.systemsData;
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                item = _a[_i];
                date = new Date(0);
                return [4 /*yield*/, pg.query({
                        text: "INSERT INTO shibuya (service_id,name,content_abstract,content_url,theme) VALUES ($1,$2,$3,$4,$5) ;",
                        values: [
                            item["PSID"],
                            item["タイトル（制度名）"],
                            item["概要"],
                            item["詳細参照先"],
                            item["タグ（テーマ）"],
                        ]
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                systemsDataKumamoto = require("../datas/kumamoto/systemsdata.json");
                _b = 0, _c = systemsDataKumamoto.systemsData;
                _d.label = 5;
            case 5:
                if (!(_b < _c.length)) return [3 /*break*/, 8];
                item = _c[_b];
                date = new Date(0);
                return [4 /*yield*/, pg.query({
                        text: "INSERT INTO kumamoto (service_id,name,content_abstract,content_url,theme) VALUES ($1,$2,$3,$4,$5) ;",
                        values: [
                            item["PSID"],
                            item["タイトル（制度名）"],
                            item["概要"],
                            item["詳細参照先"],
                            item["タグ（テーマ）"],
                        ]
                    })];
            case 6:
                _d.sent();
                _d.label = 7;
            case 7:
                _b++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/];
        }
    });
}); };
