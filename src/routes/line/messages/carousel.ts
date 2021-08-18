
import * as types from "@line/bot-sdk/lib/types";
import { SystemProperty } from "../../../classes";

module.exports = async function carouselTemplate(items: SystemProperty[], resultId: string) {
  console.log('carousel',resultId)
  if (items.length === 0) {
    return { type: "text", text: "当てはまる制度が見つかりませんでした。" };
  }

  console.log(`https://localhost:5000/others/resultId=${resultId}`);
  const carouselContents = [
    {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: String(items.length),
            align: "center",
            gravity: "center",
            size: "5xl",
            weight: "bold",
            decoration: "none",
          },
          {
            type: "text",
            text: "種類の制度が見つかりました🎉",
            weight: "bold",
            align: "center",
          },
        ],
        justifyContent: "center",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: "全ての制度を見る",
              uri: "http://linecorp.com/",
            },
            style: "primary",
          },
        ],
      },
    },
  ] as types.FlexBubble[];
  for (const item of items) {
    console.log(item["タグ（テーマ）"]);
    console.log(item["タイトル（制度名）"]);

    carouselContents.push({
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: item["タグ（テーマ）"],
                wrap: true,
                align: "end",
                color: "#8e8989",
              },
            ],
          },
        ],
      },
      hero: {
        type: "image",
        url: "https://static.civichat.jp/thumbnail-image/deferment.png",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: item["タイトル（制度名）"],
            weight: "bold",
            size: "xl",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: "詳細を見る",
              uri: `https://localhost:5000/others=${resultId}`,
            },
            style: "secondary",
          },
        ],
      },
    });
  }
  console.log(carouselContents);
  const returnMessage: types.Message = {
    type: "flex",
    altText: "検索結果",
    contents: {
      type: "carousel",
      contents: carouselContents,
    },
  };
  return returnMessage;
};
