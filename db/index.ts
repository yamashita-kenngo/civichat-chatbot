// DB操作まわりの関数をまとめて提供します
// TODO: //とりあえずpg直で叩いてるけどPrismaとかORM入れたい
const { Client } = require("pg");
const { uuid } = require("uuidv4");

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

const liffUrl = process.env.LIFF_URL;

export type pgConfig = {
  user: string;
  host: string;
  database: string;
  password: string;
  port: string;
};

const pgConfig: pgConfig = {
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB_NAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
};

console.log(pgConfig);
const pg = new Client(pgConfig);

pg.connect()
  .then(() => console.log("pg Connected successfuly"))
  .catch(() => console.log("pr err"));

exports.getServiceDetail = async (serviceId: string) => {
  // 制度IDから制度詳細を返します
  // 旧get_systems
  const res = await pg.query({
    text: "SELECT * FROM users WHERE service_id=$1;",
    values: [String(serviceId)],
  });

  if (res.rows.length < 1) {
    throw new Error("Not found");
  }

  const service = res.rows[0];

  return {
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
    howToUse: service.howToUse,
  };
};

exports.saveUser = async (lineId: string) => {
  await pg.query({
    text: "INSERT INTO users(line_id,created_at) VALUES ($1,current_timestamp);",
    values: [lineId],
  });
};

exports.isLoggedIn = async (lineId: string) => {
  // lineIdがすでにDBに乗ってたらtrue,そうでなければFalse
  const res = await pg.query({
    text: "SELECT user_id FROM users WHERE line_id=$1",
    values: [lineId],
  });

  if (res.rows.length < 1) {
    return false;
  }
  return true;
};

export type resultSaveData = {
  result: Array<{ title: string; overview: string; detailUrl: string }>;
  resultId: string;
};

exports.queryServices = async (systemIds: Array<string>, lineId: string, seido: string) => {
  const resultId: string = uuid();

  const resultSaveData: resultSaveData = {
    result: [],
    resultId: resultId,
  };

  for (const systemId of systemIds) {
    const res = await pg.query({
      text: `SELECT * FROM ${seido} WHERE service_id=$1;`,
      values: [String(systemId)],
    });
    //検索結果を配列に格納
    resultSaveData.result.push({
      title: res.rows[0].name,
      overview: res.rows[0].content_abstract,
      detailUrl: res.rows[0].content_url,
    });
  }

  const saveString = JSON.stringify(resultSaveData);

  //保存する
  await pg.query({
    text: "INSERT INTO  results(result_id,result_body,line_id,created_at) VALUES ($1,$2,$3,current_timestamp)",
    values: [resultId, saveString, lineId],
  });

  return resultId;
};

exports.getQueryResult = async (resultId: string) => {
  const res = await pg.query({
    text: "SELECT * FROM results WHERE result_id=$1;",
    values: [String(resultId)],
  });

  if (res.rows.length === 1) {
    return JSON.parse(res.rows[0].result_body);
  } else {
    return { result: [] };
  }
};

// systemsdata.jsonから制度詳細をDBに追加する関数
exports.saveInitialDatafromJson = async () => {
  const systemsDataShibuya = require("../datas/shibuya/systemsdata.json");
  for (const item of systemsDataShibuya.systemsData) {
    await pg.query({
      text: "INSERT INTO shibuya (service_id,name,content_abstract,content_url,theme) VALUES ($1,$2,$3,$4,$5) ;",
      values: [
        item["PSID"],
        item["タイトル（制度名）"],
        item["概要"],
        item["詳細参照先"],
        item["タグ（テーマ）"],
      ],
    });
  }

  const systemsDataKumamoto = require("../datas/kumamoto/systemsdata.json");
  for (const item of systemsDataKumamoto.systemsData) {
    await pg.query({
      text: "INSERT INTO kumamoto (service_id,name,content_abstract,content_url,theme) VALUES ($1,$2,$3,$4,$5) ;",
      values: [
        item["PSID"],
        item["タイトル（制度名）"],
        item["概要"],
        item["詳細参照先"],
        item["タグ（テーマ）"],
      ],
    });
  }
};