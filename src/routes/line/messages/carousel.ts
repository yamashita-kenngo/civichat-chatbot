import * as types from "@line/bot-sdk/lib/types";
import { SystemProperty } from "../../../classes";

module.exports = function carouselTemplate(
  items: SystemProperty[],
  systemsCount: number,
  resultId: string,
) {
  if (items.length === 0) {
    return { type: "text", text: "当てはまる制度が見つかりませんでした。" };
  }
  console.log(items)
  // とど：プロパティーがあってもなくても柔軟に対応できるようにする
  const carouselContents = [
    {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: String(systemsCount),
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
    },
  ] as types.FlexBubble[];
  for (const item of items) {
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
                text: item["タグ（テーマ）"] || item["行政サービス分類"] || item["エリア"] || "結果",
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
            text: item["タイトル（制度名）"] || item["制度名"] || item["幼稚園•保育園のタイトル"] || 'タイトル',
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
              uri: item["詳細参照先"] || "https://google.com",
            },
            style: "secondary",
          },
        ],
      },
    });
  }
  console.log(`利用できる${systemsCount}個の制度を見る`);
  console.log(`${process.env.LIFF_URL}/others/${resultId}`);
  const returnMessage: types.Message = {
    type: "flex",
    altText: "検索結果",
    contents: {
      type: "carousel",
      contents: carouselContents,
    },
    quickReply: {
      items: [
        {
          type: "action",
          action: {
            type: "uri",
            label: `利用できる${systemsCount}個の制度を見る`,
            uri: `${process.env.LIFF_URL}/others/${resultId}`,
          },
        },
      ],
    },
  };
  return returnMessage;
};
