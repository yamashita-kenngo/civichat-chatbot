import * as types from "@line/bot-sdk/lib/types";
import { SystemProperty } from "../../../classes";

module.exports = function carouselTemplate(
  items: SystemProperty[],
  systemsCount: number,
  resultId: string,
  othersType: string,
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
            color: "#000000",
            align: "center",
            gravity: "center",
            size: "5xl",
            weight: "bold",
            decoration: "none",
          },
          {
            type: "text",
            text: `種類の${othersType}が見つかりました🎉`,
            color: "#000000",
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
        size: "5xl",
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
            color: "#000000",
            weight: "bold",
            size: "xl",
            wrap: true,
          },
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
            size: "lg",
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
            type: "spacer",
          },
        ],
      },
    };
    if (item["概要"] || item["制度概要"]) {
      content.body.contents.push({
        type: "text",
        text: item["概要"] || item["制度概要"],
        color: "#000000",
        weight: "bold",
        margin: "md",
        size: "sm",
        wrap: true,
      });
    }
    if (item["住所"]) {
      const encodeAddress = encodeURI(item["住所"]);
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
                color: "#000000",
                contents: [],
              },
              {
                type: "text",
                text: item["住所"],
                color: "#000000",
                wrap: true,
                action: {
                  type: "uri",
                  label: "tel",
                  uri: `https://www.google.com/maps/search/?api=1&query=${encodeAddress}`,
                },
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
                color: "#000000",
                contents: [],
              },
              {
                type: "text",
                text: item["見学"],
                color: "#000000",
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    // if (item["お問い合わせ先"]) {
    //   content.body.contents.push({
    //     type: "box",
    //     layout: "vertical",
    //     margin: "md",
    //     contents: [
    //       {
    //         type: "box",
    //         layout: "horizontal",
    //         contents: [
    //           {
    //             type: "text",
    //             text: "お問い合わせ先",
    //             color: "#000000",
    //             contents: [],
    //           },
    //           {
    //             type: "text",
    //             text: item["お問い合わせ先"],
    //             color: "#000000",
    //             wrap: true,
    //             action: {
    //               type: "uri",
    //               label: "tel",
    //               uri: `tel:${item["お問い合わせ先"]}`,
    //             },
    //             contents: [],
    //           },
    //         ],
    //       },
    //     ],
    //   });
    // }
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
                color: "#000000",
                contents: [],
              },
              {
                type: "text",
                text: item["対象者"],
                color: "#000000",
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    if (item["行政サービス分類"]) {
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
                text: "行政サービス分類",
                color: "#000000",
                contents: [],
              },
              {
                type: "text",
                text: item["行政サービス分類"],
                color: "#000000",
                wrap: true,
                contents: [],
              },
            ],
          },
        ],
      });
    }
    if (item["保育施設の空き状況（0さい）"]) {
      content.body.contents.push({
        "type": "box",
        "layout": "horizontal",
        "spacing": "none",
        "margin": "md",
        "offsetStart": "1px",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "直近の空き状況",
                "color": "#000000FF",
                "contents": []
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "0歳児",
                    "color": "#000000FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "1歳児",
                    "color": "#000000FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "2歳児",
                    "color": "#000000FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "3歳児",
                    "color": "#000000FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "4歳児",
                    "color": "#000000FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "5歳児",
                    "color": "#000000FF",
                    "contents": []
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "空きなし",
                    "weight": "bold",
                    "color": "#EC1212FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "3枠あり",
                    "weight": "bold",
                    "color": "#38AE45FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "3枠あり",
                    "weight": "bold",
                    "color": "#38AE45FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "3枠あり",
                    "weight": "bold",
                    "color": "#38AE45FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "3枠あり",
                    "weight": "bold",
                    "color": "#38AE45FF",
                    "contents": []
                  },
                  {
                    "type": "text",
                    "text": "3枠あり",
                    "weight": "bold",
                    "color": "#38AE45FF",
                    "contents": []
                  }
                ]
              }
            ]
          }
        ]
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
            label: `利用できる${systemsCount}個の${othersType}を見る`,
            uri: `${process.env.LIFF_URL}/others/${resultId}`,
          },
        },
      ],
    },
  };
  return returnMessage;
};
