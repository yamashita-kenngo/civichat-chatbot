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

exports.queryServices = async (
  systemIds: Array<string>,
  lineId: string,
  seido: string
) => {
  const resultId: string = uuid();

  const resultSaveData: resultSaveData = {
    result: [],
    resultId: resultId,
  };

  for (const systemId of systemIds) {
    const res = await pg.query({
      text: `SELECT * FROM ${seido} WHERE psid=$1;`,
      values: [String(systemId)],
    });
    //検索結果を配列に格納
    resultSaveData.result.push({
      ...res.rows[0]
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
      text: "INSERT INTO shibuya (psid,service_number,origin_id,alteration_flag,provider,prefecture_id,city_id,name,abstract,provisions,target,how_to_apply,application_start_date,application_close_date,url,contact,information_release_date,tags,theme,category,person_type,entity_type,keyword_type,issue_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) ;",
      values: [
        item["PSID"],
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
        item["詳細参照先"],
        item["お問い合わせ先"],
        item["公開日"],
        item["タグ"],
        item["テーマ"],
        item["タグ（カテゴリー）"],
        item["タグ（事業者分類）"],
        item["タグ（事業者分類）"],
        item["タグ（キーワード）"],
        item["タグ（テーマ）"],
      ],
    });
  
  }

  const systemsDataKumamoto = require("../datas/kumamoto/systemsdata.json");
  for (const item of systemsDataKumamoto.systemsData) {
    await pg.query({
      text: "INSERT INTO kumamoto (psid,management_id,name,target,sub_title,priority,start_release_date,end_release_date,is_release,overview,organization,parent_system,relationship_parent_system,qualification,purpose,area,support_content,note,how_to_use,needs,documents_url,postal_address,acceptable_dates,acceptable_times,apply_url,start_application_date,end_application_date,contact,detail_url,administrative_service_category,lifestage_category,problem_category                                                                                                                                                                     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32) ;",
      values: [
        item["PSID"],
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
        item["お困りごと分類"],
      ],
    });
  }

  const systemsDataShibuyaKindergarten = require("../datas/shibuyaKindergarten/systemsdata.json");
  for (const item of systemsDataShibuyaKindergarten.systemsData) {
    await pg.query({
      text: "INSERT INTO shibuyakindergarten (psid,prefecture_id,city_id,area,name,target_age,type_nursery_school,administrator,closed_days,playground,bringing_your_own_towel,take_out_diapers,parking,lunch,ibservation,extended_hours_childcare,allergy_friendly,admission_available,apply,url,contact,information_release_date,availability_of_childcare_facilities_for_0,availability_of_childcare_facilities_for_1,availability_of_childcare_facilities_for_2,availability_of_childcare_facilities_for_3,availability_of_childcare_facilities_for_4,availability_of_childcare_facilities_for_5,location) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29) ;",
      values: [
        item["PSID"],
        item["都道府県"],
        item["市町村"],
        item["エリア"],
        item["幼稚園・保育園のタイトル"],
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
        item["詳細参照先"],
        item["お問い合わせ先"],
        item["公開日"],
        item["保育施設の空き状況（0さい）"],
        item["保育施設の空き状況（1さい）"],
        item["保育施設の空き状況（2さい）"],
        item["保育施設の空き状況（3さい）"],
        item["保育施設の空き状況（4さい）"],
        item["保育施設の空き状況（5さい）"],
        item["住所"],
      ],
    });
  }
};
