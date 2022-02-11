// DB操作まわりの関数をまとめて提供します


// TODO: //とりあえずpg直で叩いてるけどPrismaとかORM入れたい
const { Client } = require("pg");
const { v4: uuidv4 } = require('uuid');
const pgParse = require('pg-connection-string').parse;

require("dotenv").config();

if(!process.env.DATABASE_URL) throw new Error("Environment variable DATABASE_URL is not set.");

/*if (!process.env.RDS_HOSTNAME) {
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
}*/

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
  ssl: any;
};

var config = pgParse(process.env.DATABASE_URL)
const pgConfig: pgConfig = {
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
  ssl: { rejectUnauthorized: false }
};

console.log(pgConfig);
const pg = new Client(pgConfig);

pg.connect()
  .then(() => console.log("pg Connected successfuly"))
  .catch((e: string) => console.log("pr err\n"+e));

exports.getServiceDetail = async (serviceId: string) => {
  const tableName = serviceId.split("-")[0];
  const res = await pg.query({
    text: `SELECT * FROM ${tableName} WHERE service_id=$1;`,
    values: [String(serviceId)],
  });

  if (res.rows.length < 1) {
    throw new Error("Not found");
  }

  const seidoType = serviceId.split("-")[0];
  const img_url = getImageUrl(seidoType);

  const service = res.rows[0];

  return {
    ...service,
    image_url: img_url,
    uri: liffUrl + "/info/" + serviceId,
  };
};

exports.saveUser = async (lineId: string) => {
  const res = await pg.query({
    text: "SELECT user_id FROM users WHERE line_id=$1",
    values: [lineId],
  });

  if (res.rows.length < 1) {
    await pg.query({
      text: "INSERT INTO users(line_id,count,created_at) VALUES ($1,$2,current_timestamp);",
      values: [lineId, 0],
    });
  }
};

exports.updateUserCount = async (lineId: string) => {
  const res = await pg.query({
    text: "SELECT user_id FROM users WHERE line_id=$1",
    values: [lineId],
  });
  console.log(res)

  /*if (res.rows.length === 1) {
    await pg.query({
      text: "UPDATE users SET count=count+1 WHERE line_id=$1;",
      values: [lineId],
    });
  }*/
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
  const resultId: string = uuidv4();

  const resultSaveData: resultSaveData = {
    result: [],
    resultId: resultId,
  };

  let othersType: string;
  if (seido === "shibuya_preschool") {
    othersType = "施設";
  } else if (seido === "shibuya_parenting" || seido === "kumamoto_earthquake"|| seido === "japan") {
    othersType = "制度";
  } else {
    othersType = "";
  }

  let imgUrl;
  if (seido === "shibuya_parenting" || seido === "shibuya_preschool") {
    imgUrl =
      "https://static.civichat.jp/thumbnail-image/babycar_woman_color.png";
  } else {
    imgUrl = "https://static.civichat.jp/thumbnail-image/savings.png";
  }
  for (const systemId of systemIds) {
    const res = await pg.query({
      text: `SELECT * FROM ${seido} WHERE service_id=$1;`,
      values: [String(systemId)],
    });
    //検索結果を配列に格納
    resultSaveData.result.push({
      ...res.rows[0],
      othersType: othersType,
    });
  }
  const saveString = JSON.stringify(resultSaveData);

  //保存する
  await pg.query({
    text: "INSERT INTO  results(result_id,result_body,line_id,src_table,created_at) VALUES ($1,$2,$3,$4,current_timestamp)",
    values: [resultId, saveString, lineId, seido],
  });
  return [resultId,othersType,imgUrl];

};

exports.getQueryResult = async (resultId: string) => {
  const res = await pg.query({
    text: "SELECT * FROM results WHERE result_id=$1;",
    values: [String(resultId)],
  });

  const seidoType = JSON.parse(
    res.rows[0].result_body
  ).result[0].service_id.split("-")[0];
  const img_url = getImageUrl(seidoType);
  if (res.rows.length === 1) {
    return {
      result: JSON.parse(res.rows[0].result_body).result,
      img_url: img_url,
    };
  } else {
    return { result: [] };
  }
};

// systemsdata.jsonから制度詳細をDBに追加する関数
exports.saveInitialDatafromJson = async () => {

  await pg.query({
    text: `
    CREATE TABLE "apply_locations" (
      "service_id" text,
      "application_lcoation" text,
      PRIMARY KEY ("service_id", "application_lcoation")
    );`
  })

  await pg.query({
    text: `CREATE TABLE "apply_postal_address" (
      "service_id" text,
      "postal_address" text,
      PRIMARY KEY ("service_id", "postal_address")
    );`
  })

  await pg.query({
    text: `CREATE TABLE "documents" (
      "service_id" text,
      "document_name" text,
      "document_url" text,
      PRIMARY KEY ("service_id", "document_name")
    );`
  })

  await pg.query({
    text: `CREATE TABLE "related_system" (
      "subject_service_id" text,
      "object_service_id" text,
      "relationship" text,
      PRIMARY KEY ("subject_service_id", "object_service_id")
    );`
  })

  await pg.query({
    text: `CREATE TABLE "shibuya_parenting" (
      "id" serial PRIMARY KEY,
      "service_id" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,
      "service_number" text,
      "origin_id" text,
      "alteration_flag" text,
      "provider" text,
      "prefecture_id" text,
      "city_id" text,
      "name" text,
      "abstract" text,
      "provisions" text,
      "target" text,
      "how_to_apply" text,
      "application_start_date" text,
      "application_close_date" text,
      "detail_url" text,
      "contact" text,
      "information_release_date" text,
      "tags" text,
      "theme" text,
      "category" text,
      "person_type" text,
      "entity_type" text,
      "keyword_type" text,
      "issue_type" text
    );`
  })

  await pg.query({
    text: `CREATE TABLE "japan" (
      "id" serial PRIMARY KEY,
      "service_id" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,
      "service_number" text,
      "origin_id" text,
      "alteration_flag" text,
      "provider" text,
      "prefecture_id" text,
      "city_id" text,
      "name" text,
      "abstract" text,
      "provisions" text,
      "target" text,
      "how_to_apply" text,
      "application_start_date" text,
      "application_close_date" text,
      "detail_url" text,
      "contact" text,
      "information_release_date" text,
      "tags" text,
      "theme" text,
      "category" text,
      "person_type" text,
      "entity_type" text,
      "keyword_type" text,
      "issue_type" text
    );`
  })

  await pg.query({
    text: `CREATE TABLE "kumamoto_earthquake" (
      "id" serial PRIMARY KEY,
      "service_id" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,
      "management_id" text,
      "name" text,
      "target" text,
      "sub_title" text,
      "priority" text,
      "start_release_date" text,
      "end_release_date" text,
      "is_release" text,
      "overview" text,
      "organization" text,
      "parent_system" text,
      "relationship_parent_system" text,
      "qualification" text,
      "purpose" text,
      "area" text,
      "support_content" text,
      "note" text,
      "how_to_use" text,
      "needs" text,
      "documents_url" text,
      "postal_address" text,
      "acceptable_dates" text,
      "acceptable_times" text,
      "apply_url" text,
      "start_application_date" text,
      "end_application_date" text,
      "contact" text,
      "detail_url" text,
      "administrative_service_category" text,
      "lifestage_category" text,
      "problem_category" text
    );`
  })

  await pg.query({
    text: `CREATE TABLE "shibuya_preschool" (
      "id" serial PRIMARY KEY,
      "service_id" character varying(255) NOT NULL UNIQUE UNIQUE UNIQUE,
      "prefecture_id" text,
      "city_id" text,
      "area" text,
      "name" text,
      "target_age" text,
      "type_nursery_school" text,
      "administrator" text,
      "closed_days" text,
      "playground" text,
      "bringing_your_own_towel" text,
      "take_out_diapers" text,
      "parking" text,
      "lunch" text,
      "ibservation" text,
      "extended_hours_childcare" text,
      "allergy_friendly" text,
      "admission_available" text,
      "apply" text,
      "detail_url" text,
      "contact" text,
      "information_release_date" text,
      "availability_of_childcare_facilities_for_0" text,
      "availability_of_childcare_facilities_for_1" text,
      "availability_of_childcare_facilities_for_2" text,
      "availability_of_childcare_facilities_for_3" text,
      "availability_of_childcare_facilities_for_4" text,
      "availability_of_childcare_facilities_for_5" text,
      "location" text,
      "thisyear_admission_rate_for_0" text,
      "thisyear_admission_rate_for_1" text,
      "thisyear_admission_rate_for_2" text,
      "thisyear_admission_rate_for_3" text,
      "thisyear_admission_rate_for_4" text,
      "thisyear_admission_rate_for_5" text,
      "thisyear_admission_point_for_0" text,
      "thisyear_admission_point_for_1" text,
      "thisyear_admission_point_for_2" text,
      "thisyear_admission_point_for_3" text,
      "thisyear_admission_point_for_4" text,
      "thisyear_admission_point_for_5" text,
      "lastyear_admission_rate_for_0" text,
      "lastyear_admission_rate_for_1" text,
      "lastyear_admission_rate_for_2" text,
      "lastyear_admission_rate_for_3" text,
      "lastyear_admission_rate_for_4" text,
      "lastyear_admission_rate_for_5" text,
      "lastyear_admission_point_for_0" text,
      "lastyear_admission_point_for_1" text,
      "lastyear_admission_point_for_2" text,
      "lastyear_admission_point_for_3" text,
      "lastyear_admission_point_for_4" text,
      "lastyear_admission_point_for_5" text,
      "security" text,
      "baby_buggy" text,
      "ibservation_detail" text
    );`
  })

  await pg.query({
    text: `CREATE TABLE "users" (
      "line_id" text,
      "created_at" text
    );`
  })

  await pg.query({
    text: `CREATE TABLE "results" (
      "result_id" text,
      "result_body" text,
      "line_id" text,
      "src_table" text,
      "created_at" text
    );`
  })

  await pg.query({
    text: `ALTER TABLE "apply_locations"
    ADD FOREIGN KEY ("service_id") REFERENCES "shibuya_parenting" ("service_id");`
  })

  await pg.query({
    text: `ALTER TABLE "apply_postal_address"
  ADD FOREIGN KEY ("service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "documents"
  ADD FOREIGN KEY ("service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "related_system"
  ADD FOREIGN KEY ("subject_service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "related_system"
  ADD FOREIGN KEY ("object_service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "apply_locations"
  ADD FOREIGN KEY ("service_id") REFERENCES "kumamoto_earthquake" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "apply_postal_address"
  ADD FOREIGN KEY ("service_id") REFERENCES "kumamoto_earthquake" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "documents"
  ADD FOREIGN KEY ("service_id") REFERENCES "kumamoto_earthquake" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "related_system"
  ADD FOREIGN KEY ("subject_service_id") REFERENCES "kumamoto_earthquake" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "related_system"
  ADD FOREIGN KEY ("object_service_id") REFERENCES "kumamoto_earthquake" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "apply_locations"
  ADD FOREIGN KEY ("service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "apply_postal_address"
  ADD FOREIGN KEY ("service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "documents"
  ADD FOREIGN KEY ("service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "related_system"
  ADD FOREIGN KEY ("subject_service_id") REFERENCES "shibuya_parenting" ("service_id");`
})

  await pg.query({
    text: `ALTER TABLE "related_system"
  ADD FOREIGN KEY ("object_service_id") REFERENCES "shibuya_parenting" ("service_id");`
})
  const systemsDataShibuya = require("../../static_data/shibuyaParenting/systemsdata.json");
  for (const item of systemsDataShibuya.systemsData) {
    await pg.query({
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
      ],
    });
  }

  const systemsDataKumamoto = require("../../static_data/kumamotoEarthquake/systemsdata.json");
  for (const item of systemsDataKumamoto.systemsData) {
    await pg.query({
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
      ],
    });
  }

  const systemsDataShibuyaKindergarten = require("../../static_data/shibuyaPreschool/systemsdata.json");
  for (const item of systemsDataShibuyaKindergarten.systemsData) {
    await pg.query({
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
      ],
    });
  }

  const systemsDataJapan = require("../../static_data/japan/systemsdata.json");
  for (const item of systemsDataJapan.systemsData) {
    await pg.query({
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
      ],
    });
  }
  return "ok";
};

function getImageUrl(seidoType: string) {
  let img_url: string;
  if (seidoType === "shibuya_preschool" || seidoType === "shibuya_parenting") {
    img_url =
      "https://static.civichat.jp/thumbnail-image/babycar_man_color.png";
  } else if (seidoType === "kumamoto_earthquake") {
    img_url = "https://static.civichat.jp/thumbnail-image/support.png";
  } else {
    img_url = "https://static.civichat.jp/thumbnail-image/support.png";
  }
  return img_url;
}
