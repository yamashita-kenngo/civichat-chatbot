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
    port: process.env.RDS_PORT
};
console.log(pgConfig);
var pg = new Client(pgConfig);
pg.connect()
    .then(function () { return console.log("pg Connected successfuly"); })["catch"](function () { return console.log("pr err"); });
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
<<<<<<< Updated upstream
    var systemsDataJapan, _i, _a, item;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                systemsDataJapan = require("../../static_data/japan/systemsdata.json");
                _i = 0, _a = systemsDataJapan.systemsData;
                _b.label = 1;
=======
    var systemsDataShibuya, _i, _a, item, systemsDataKumamoto, _b, _c, item, systemsDataShibuyaKindergarten, _d, _e, item, systemsDataJapan, _f, _g, item;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, pg.query({
                    text: "\n    CREATE TABLE \"apply_locations\" (\n      \"service_id\" text,\n      \"application_lcoation\" text,\n      PRIMARY KEY (\"service_id\", \"application_lcoation\")\n    );"
                })];
>>>>>>> Stashed changes
            case 1:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"apply_postal_address\" (\n      \"service_id\" text,\n      \"postal_address\" text,\n      PRIMARY KEY (\"service_id\", \"postal_address\")\n    );"
                    })];
            case 2:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"documents\" (\n      \"service_id\" text,\n      \"document_name\" text,\n      \"document_url\" text,\n      PRIMARY KEY (\"service_id\", \"document_name\")\n    );"
                    })];
            case 3:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"related_system\" (\n      \"subject_service_id\" text,\n      \"object_service_id\" text,\n      \"relationship\" text,\n      PRIMARY KEY (\"subject_service_id\", \"object_service_id\")\n    );"
                    })];
            case 4:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"shibuya_parenting\" (\n      \"id\" serial PRIMARY KEY,\n      \"service_id\" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,\n      \"service_number\" text,\n      \"origin_id\" text,\n      \"alteration_flag\" text,\n      \"provider\" text,\n      \"prefecture_id\" text,\n      \"city_id\" text,\n      \"name\" text,\n      \"abstract\" text,\n      \"provisions\" text,\n      \"target\" text,\n      \"how_to_apply\" text,\n      \"application_start_date\" text,\n      \"application_close_date\" text,\n      \"detail_url\" text,\n      \"contact\" text,\n      \"information_release_date\" text,\n      \"tags\" text,\n      \"theme\" text,\n      \"category\" text,\n      \"person_type\" text,\n      \"entity_type\" text,\n      \"keyword_type\" text,\n      \"issue_type\" text\n    );"
                    })];
            case 5:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"japan\" (\n      \"id\" serial PRIMARY KEY,\n      \"service_id\" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,\n      \"service_number\" text,\n      \"origin_id\" text,\n      \"alteration_flag\" text,\n      \"provider\" text,\n      \"prefecture_id\" text,\n      \"city_id\" text,\n      \"name\" text,\n      \"abstract\" text,\n      \"provisions\" text,\n      \"target\" text,\n      \"how_to_apply\" text,\n      \"application_start_date\" text,\n      \"application_close_date\" text,\n      \"detail_url\" text,\n      \"contact\" text,\n      \"information_release_date\" text,\n      \"tags\" text,\n      \"theme\" text,\n      \"category\" text,\n      \"person_type\" text,\n      \"entity_type\" text,\n      \"keyword_type\" text,\n      \"issue_type\" text\n    );"
                    })];
            case 6:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"kumamoto_earthquake\" (\n      \"id\" serial PRIMARY KEY,\n      \"service_id\" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,\n      \"management_id\" text,\n      \"name\" text,\n      \"target\" text,\n      \"sub_title\" text,\n      \"priority\" text,\n      \"start_release_date\" text,\n      \"end_release_date\" text,\n      \"is_release\" text,\n      \"overview\" text,\n      \"organization\" text,\n      \"parent_system\" text,\n      \"relationship_parent_system\" text,\n      \"qualification\" text,\n      \"purpose\" text,\n      \"area\" text,\n      \"support_content\" text,\n      \"note\" text,\n      \"how_to_use\" text,\n      \"needs\" text,\n      \"documents_url\" text,\n      \"postal_address\" text,\n      \"acceptable_dates\" text,\n      \"acceptable_times\" text,\n      \"apply_url\" text,\n      \"start_application_date\" text,\n      \"end_application_date\" text,\n      \"contact\" text,\n      \"detail_url\" text,\n      \"administrative_service_category\" text,\n      \"lifestage_category\" text,\n      \"problem_category\" text\n    );"
                    })];
            case 7:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"shibuya_preschool\" (\n      \"id\" serial PRIMARY KEY,\n      \"service_id\" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,\n      \"prefecture_id\" text,\n      \"city_id\" text,\n      \"area\" text,\n      \"name\" text,\n      \"target_age\" text,\n      \"type_nursery_school\" text,\n      \"administrator\" text,\n      \"closed_days\" text,\n      \"playground\" text,\n      \"bringing_your_own_towel\" text,\n      \"take_out_diapers\" text,\n      \"parking\" text,\n      \"lunch\" text,\n      \"ibservation\" text,\n      \"extended_hours_childcare\" text,\n      \"allergy_friendly\" text,\n      \"admission_available\" text,\n      \"apply\" text,\n      \"detail_url\" text,\n      \"contact\" text,\n      \"information_release_date\" text,\n      \"availability_of_childcare_facilities_for_0\" text,\n      \"availability_of_childcare_facilities_for_1\" text,\n      \"availability_of_childcare_facilities_for_2\" text,\n      \"availability_of_childcare_facilities_for_3\" text,\n      \"availability_of_childcare_facilities_for_4\" text,\n      \"availability_of_childcare_facilities_for_5\" text,\n      \"location\" text,\n      \"thisyear_admission_rate_for_0\" text,\n      \"thisyear_admission_rate_for_1\" text,\n      \"thisyear_admission_rate_for_2\" text,\n      \"thisyear_admission_rate_for_3\" text,\n      \"thisyear_admission_rate_for_4\" text,\n      \"thisyear_admission_rate_for_5\" text,\n      \"thisyear_admission_point_for_0\" text,\n      \"thisyear_admission_point_for_1\" text,\n      \"thisyear_admission_point_for_2\" text,\n      \"thisyear_admission_point_for_3\" text,\n      \"thisyear_admission_point_for_4\" text,\n      \"thisyear_admission_point_for_5\" text,\n      \"lastyear_admission_rate_for_0\" text,\n      \"lastyear_admission_rate_for_1\" text,\n      \"lastyear_admission_rate_for_2\" text,\n      \"lastyear_admission_rate_for_3\" text,\n      \"lastyear_admission_rate_for_4\" text,\n      \"lastyear_admission_rate_for_5\" text,\n      \"lastyear_admission_point_for_0\" text,\n      \"lastyear_admission_point_for_1\" text,\n      \"lastyear_admission_point_for_2\" text,\n      \"lastyear_admission_point_for_3\" text,\n      \"lastyear_admission_point_for_4\" text,\n      \"lastyear_admission_point_for_5\" text,\n      \"security\" text,\n      \"baby_buggy\" text,\n      \"ibservation_detail\" text\n    );"
                    })];
            case 8:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"users\" (\n      \"line_id\" text,\n      \"created_at\" text\n    );"
                    })];
            case 9:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "CREATE TABLE \"results\" (\n      \"result_id\" text,\n      \"result_body\" text,\n      \"line_id\" text,\n      \"src_table\" text,\n      \"created_at\" text\n    );"
                    })];
            case 10:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"apply_locations\"\n    ADD FOREIGN KEY (\"service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 11:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"apply_postal_address\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 12:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"documents\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 13:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"related_system\"\n  ADD FOREIGN KEY (\"subject_service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 14:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"related_system\"\n  ADD FOREIGN KEY (\"object_service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 15:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"apply_locations\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"kumamoto_earthquake\" (\"service_id\");"
                    })];
            case 16:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"apply_postal_address\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"kumamoto_earthquake\" (\"service_id\");"
                    })];
            case 17:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"documents\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"kumamoto_earthquake\" (\"service_id\");"
                    })];
            case 18:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"related_system\"\n  ADD FOREIGN KEY (\"subject_service_id\") REFERENCES \"kumamoto_earthquake\" (\"service_id\");"
                    })];
            case 19:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"related_system\"\n  ADD FOREIGN KEY (\"object_service_id\") REFERENCES \"kumamoto_earthquake\" (\"service_id\");"
                    })];
            case 20:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"apply_locations\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 21:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"apply_postal_address\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 22:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"documents\"\n  ADD FOREIGN KEY (\"service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 23:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"related_system\"\n  ADD FOREIGN KEY (\"subject_service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 24:
                _h.sent();
                return [4 /*yield*/, pg.query({
                        text: "ALTER TABLE \"related_system\"\n  ADD FOREIGN KEY (\"object_service_id\") REFERENCES \"shibuya_parenting\" (\"service_id\");"
                    })];
            case 25:
                _h.sent();
                systemsDataShibuya = require("../../static_data/shibuyaParenting/systemsdata.json");
                _i = 0, _a = systemsDataShibuya.systemsData;
                _h.label = 26;
            case 26:
                if (!(_i < _a.length)) return [3 /*break*/, 29];
                item = _a[_i];
                return [4 /*yield*/, pg.query({
<<<<<<< Updated upstream
=======
                        text: "INSERT INTO shibuya_parenting (service_id,service_number,origin_id,alteration_flag,provider,prefecture_id,city_id,name,abstract,provisions,target,how_to_apply,application_start_date,application_close_date,contact,information_release_date,tags,theme,category,person_type,entity_type,keyword_type,issue_type,detail_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) ;",
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
            case 27:
                _h.sent();
                _h.label = 28;
            case 28:
                _i++;
                return [3 /*break*/, 26];
            case 29:
                systemsDataKumamoto = require("../../static_data/kumamotoEarthquake/systemsdata.json");
                _b = 0, _c = systemsDataKumamoto.systemsData;
                _h.label = 30;
            case 30:
                if (!(_b < _c.length)) return [3 /*break*/, 33];
                item = _c[_b];
                return [4 /*yield*/, pg.query({
                        text: "INSERT INTO kumamoto_earthquake (service_id,management_id,name,target,sub_title,priority,start_release_date,end_release_date,is_release,overview,organization,parent_system,relationship_parent_system,qualification,purpose,area,support_content,note,how_to_use,needs,documents_url,postal_address,acceptable_dates,acceptable_times,apply_url,start_application_date,end_application_date,contact,detail_url,administrative_service_category,lifestage_category,problem_category                                                                                                                                                                     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32) ;",
                        values: [
                            item["サービスID"],
                            item["制度管理番号"],
                            item["制度名"],
                            item["対象者"],
                            item["サブタイトル"],
                            item["表示優先度"],
                            item["公開日程"],
                            item["申請期限（公開終了日）"],
                            item["公開・非公開（チェックで公開）"],
                            item["制度概要"],
                            item["制度所管組織"],
                            item["親制度"],
                            item["親制度との関係性"],
                            item["条件"],
                            item["用途・対象物"],
                            item["対象地域"],
                            item["支援内容"],
                            item["留意事項"],
                            item["手続き等"],
                            item["必要なもの"],
                            item["必要書類のURL"],
                            item["申請窓口"],
                            item["受付可能日時（受付日）"],
                            item["受付可能日時（受付時間）"],
                            item["申請可能URL"],
                            item["受付開始日"],
                            item["受付終了日"],
                            item["お問い合わせ先"],
                            item["詳細参照先"],
                            item["行政サービス分類"],
                            item["ライフステージ分類"],
                            item["お困りごと分類"]
                        ]
                    })];
            case 31:
                _h.sent();
                _h.label = 32;
            case 32:
                _b++;
                return [3 /*break*/, 30];
            case 33:
                systemsDataShibuyaKindergarten = require("../../static_data/shibuyaPreschool/systemsdata.json");
                _d = 0, _e = systemsDataShibuyaKindergarten.systemsData;
                _h.label = 34;
            case 34:
                if (!(_d < _e.length)) return [3 /*break*/, 37];
                item = _e[_d];
                return [4 /*yield*/, pg.query({
                        text: "INSERT INTO shibuya_preschool (service_id,prefecture_id,city_id,area,name,target_age,type_nursery_school,administrator,closed_days,playground,bringing_your_own_towel,take_out_diapers,parking,lunch,ibservation,extended_hours_childcare,allergy_friendly,admission_available,apply,contact,information_release_date,availability_of_childcare_facilities_for_0,availability_of_childcare_facilities_for_1,availability_of_childcare_facilities_for_2,availability_of_childcare_facilities_for_3,availability_of_childcare_facilities_for_4,availability_of_childcare_facilities_for_5,location,thisyear_admission_rate_for_0,thisyear_admission_rate_for_1,thisyear_admission_rate_for_2,thisyear_admission_rate_for_3,thisyear_admission_rate_for_4,thisyear_admission_rate_for_5,thisyear_admission_point_for_0,thisyear_admission_point_for_1,thisyear_admission_point_for_2,thisyear_admission_point_for_3,thisyear_admission_point_for_4,thisyear_admission_point_for_5,lastyear_admission_rate_for_0,lastyear_admission_rate_for_1,lastyear_admission_rate_for_2,lastyear_admission_rate_for_3,lastyear_admission_rate_for_4,lastyear_admission_rate_for_5,lastyear_admission_point_for_0,lastyear_admission_point_for_1,lastyear_admission_point_for_2,lastyear_admission_point_for_3,lastyear_admission_point_for_4,lastyear_admission_point_for_5,security,baby_buggy,ibservation_detail,detail_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56 ) ;",
                        values: [
                            item["サービスID"],
                            item["都道府県"],
                            item["市町村"],
                            item["エリア"],
                            item["幼稚園•保育園のタイトル"],
                            item["対象年齢"],
                            item["施設のカテゴリ"],
                            item["施設の運営者"],
                            item["休園日"],
                            item["園庭"],
                            item["タオルの持ち込み"],
                            item["オムツの持ち帰り"],
                            item["駐輪場"],
                            item["給食・離乳食"],
                            item["見学"],
                            item["延長保育の対応時間"],
                            item["アレルギー対応"],
                            item["入園可能"],
                            item["申し込み受付先"],
                            item["お問い合わせ先"],
                            item["公開日"],
                            item["保育施設の空き状況（0さい）"],
                            item["保育施設の空き状況（1さい）"],
                            item["保育施設の空き状況（2さい）"],
                            item["保育施設の空き状況（3さい）"],
                            item["保育施設の空き状況（4さい）"],
                            item["保育施設の空き状況（5さい）"],
                            item["住所"],
                            item["今年の保育所利用の倍率（0さい）"],
                            item["今年の保育所利用の倍率（1さい）"],
                            item["今年の保育所利用の倍率（2さい）"],
                            item["今年の保育所利用の倍率（3さい）"],
                            item["今年の保育所利用の倍率（4さい）"],
                            item["今年の保育所利用の倍率（5さい）"],
                            item["今年の保育所利用の指数・ポイント（0さい）"],
                            item["今年の保育所利用の指数・ポイント（1さい）"],
                            item["今年の保育所利用の指数・ポイント（2さい）"],
                            item["今年の保育所利用の指数・ポイント（3さい）"],
                            item["今年の保育所利用の指数・ポイント（4さい）"],
                            item["今年の保育所利用の指数・ポイント（5さい）"],
                            item["去年の保育所利用の倍率（0さい）"],
                            item["去年の保育所利用の倍率（1さい）"],
                            item["去年の保育所利用の倍率（2さい）"],
                            item["去年の保育所利用の倍率（3さい）"],
                            item["去年の保育所利用の倍率（4さい）"],
                            item["去年の保育所利用の倍率（5さい）"],
                            item["去年の保育所利用の指数・ポイント（0さい）"],
                            item["去年の保育所利用の指数・ポイント（1さい）"],
                            item["去年の保育所利用の指数・ポイント（2さい）"],
                            item["去年の保育所利用の指数・ポイント（3さい）"],
                            item["去年の保育所利用の指数・ポイント（4さい）"],
                            item["去年の保育所利用の指数・ポイント（5さい）"],
                            item["保育施設のセキュリティ"],
                            item["ベビーバギー置き場"],
                            item["見学詳細"],
                            item["詳細参照先"]
                        ]
                    })];
            case 35:
                _h.sent();
                _h.label = 36;
            case 36:
                _d++;
                return [3 /*break*/, 34];
            case 37:
                systemsDataJapan = require("../../static_data/japan/systemsdata.json");
                _f = 0, _g = systemsDataJapan.systemsData;
                _h.label = 38;
            case 38:
                if (!(_f < _g.length)) return [3 /*break*/, 41];
                item = _g[_f];
                return [4 /*yield*/, pg.query({
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, "ok"];
=======
            case 39:
                _h.sent();
                _h.label = 40;
            case 40:
                _f++;
                return [3 /*break*/, 38];
            case 41: return [2 /*return*/, "ok"];
>>>>>>> Stashed changes
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
