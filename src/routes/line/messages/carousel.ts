import * as types from "@line/bot-sdk/lib/types";
import { SystemProperty } from "../../../classes";

module.exports = function carouselTemplate(
  items: SystemProperty[],
  systemsCount: number,
  resultId: string,
  imgUrl: string
) {
  if (items.length === 0) {
    return { type: "text", text: "当てはまる制度が見つかりませんでした。" };
  }
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
    const content: types.FlexBubble = {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "filler",
          },
        ],
      },
      hero: {
        type: "image",
        url: imgUrl,
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "fit",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text:
              item["タイトル（制度名）"] ||
              item["制度名"] ||
              item["幼稚園•保育園のタイトル"] ||
              "タイトル",
            weight: "bold",
            size: "xl",
            wrap: true,
          },
          // ここに概要を追加する
          //ここにboxを適宜追加する
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        margin: "xxl",
        contents: [
          {
            type: "text",
            text: "詳しく見る",
            weight: "bold",
            size: "xl",
            color: "#177BDCFF",
            align: "center",
            margin: "md",
            action: {
              type: "uri",
              label: "詳しく見る",
              uri: `${process.env.LIFF_URL}/services/${item["サービスID"]}`,
            },
            contents: [],
          },
          {
            type: "filler",
          },
        ],
      },
    };
    if (item["概要"] || item["制度概要"]) {
      content.body.contents.push({
        type: "text",
        text: item["概要"] || item["制度概要"],
        weight: "bold",
        margin: "md",
        size: "sm",
        wrap: true,
      });
    }
    if (item["住所"]) {
      content.body.contents.push({
        type: "box",
        layout: "vertical",
        margin: "md",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "住所",
                contents: [],
              },
              {
                type: "text",
                text: item["住所"],
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    if (item["見学"]) {
      content.body.contents.push({
        type: "box",
        layout: "vertical",
        margin: "md",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "見学",
                contents: [],
              },
              {
                type: "text",
                text: item["見学"],
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    if (item["お問い合わせ先"]) {
      content.body.contents.push({
        type: "box",
        layout: "vertical",
        margin: "md",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "お問い合わせ先",
                contents: [],
              },
              {
                type: "text",
                text: item["お問い合わせ先"],
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    if (item["対象者"]) {
      content.body.contents.push({
        type: "box",
        layout: "vertical",
        margin: "md",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "対象者",
                contents: [],
              },
              {
                type: "text",
                text: item["対象者"],
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    if (item["支援内容"]) {
      content.body.contents.push({
        type: "box",
        layout: "vertical",
        margin: "md",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "支援内容",
                contents: [],
              },
              {
                type: "text",
                text: item["支援内容"],
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    carouselContents.push(content);
  }
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
