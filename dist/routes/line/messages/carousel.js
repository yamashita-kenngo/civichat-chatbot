"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function carouselTemplate(items, systemsCount, resultId, othersType, imgUrl) {
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
    ];
    for (const item of items) {
        const content = {
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
                size: "3xl",
                aspectRatio: "20:13",
                aspectMode: "fit",
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: item["タイトル（制度名）"] ||
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
                margin: "none",
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
                                color: "#6A6A6A",
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
                                color: "#6A6A6A",
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
                                color: "#6A6A6A",
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
                                color: "#6A6A6A",
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
        if (item["去年の保育所利用の倍率（0さい）"] ||
            item["去年の保育所利用の指数・ポイント（0さい）"]) {
            content.body.contents.push({
                type: "text",
                text: "aa",
                weight: "bold",
                size: "lg",
                align: "start",
                margin: "md",
                contents: [
                    {
                        type: "span",
                        text: "前年度の申込状況",
                        color: "#6A6A6A",
                        size: "md",
                    },
                ],
            }, {
                type: "text",
                text: "hello, world",
                contents: [
                    {
                        type: "span",
                        text: "（倍率／最下指数）",
                        color: "#6A6A6A",
                        size: "md",
                        weight: "regular",
                    },
                ],
            }, {
                type: "box",
                layout: "horizontal",
                margin: "md",
                contents: [
                    {
                        type: "text",
                        text: "0歳児",
                        color: "#6A6A6A",
                        weight: "regular",
                        align: "start",
                        contents: [],
                    },
                    {
                        type: "text",
                        text: `${item["去年の保育所利用の倍率（0さい）"] != null
                            ? item["去年の保育所利用の倍率（0さい）"]
                            : "-"}／${item["去年の保育所利用の指数・ポイント（0さい）"] != null
                            ? item["去年の保育所利用の指数・ポイント（0さい）"]
                            : `-`}`,
                        color: "#000000",
                        align: "end",
                        wrap: true,
                        contents: [],
                    },
                ],
            }, {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "text",
                        text: "1歳児",
                        color: "#6A6A6A",
                        weight: "regular",
                        align: "start",
                        contents: [],
                    },
                    {
                        type: "text",
                        text: `${item["去年の保育所利用の倍率（1さい）"] != null
                            ? item["去年の保育所利用の倍率（1さい）"]
                            : "-"}／${item["去年の保育所利用の指数・ポイント（1さい）"] != null
                            ? item["去年の保育所利用の指数・ポイント（1さい）"]
                            : `-`}`,
                        color: "#000000",
                        align: "end",
                        wrap: true,
                        contents: [],
                    },
                ],
            }, {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "text",
                        text: "2歳児",
                        color: "#6A6A6A",
                        weight: "regular",
                        align: "start",
                        contents: [],
                    },
                    {
                        type: "text",
                        text: `${item["去年の保育所利用の倍率（2さい）"] != null
                            ? item["去年の保育所利用の倍率（2さい）"]
                            : "-"}／${item["去年の保育所利用の指数・ポイント（2さい）"] != null
                            ? item["去年の保育所利用の指数・ポイント（2さい）"]
                            : `-`}`,
                        color: "#000000",
                        align: "end",
                        wrap: true,
                        contents: [],
                    },
                ],
            }, {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "text",
                        text: "3歳児",
                        color: "#6A6A6A",
                        weight: "regular",
                        align: "start",
                        contents: [],
                    },
                    {
                        type: "text",
                        text: `${item["去年の保育所利用の倍率（3さい）"] != null
                            ? item["去年の保育所利用の倍率（3さい）"]
                            : "-"}／${item["去年の保育所利用の指数・ポイント（3さい）"] != null
                            ? item["去年の保育所利用の指数・ポイント（3さい）"]
                            : `-`}`,
                        color: "#000000",
                        align: "end",
                        wrap: true,
                        contents: [],
                    },
                ],
            }, {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "text",
                        text: "4歳児",
                        weight: "regular",
                        align: "start",
                        contents: [],
                    },
                    {
                        type: "text",
                        text: `${item["去年の保育所利用の倍率（4さい）"] != null
                            ? item["去年の保育所利用の倍率（4さい）"]
                            : "-"}／${item["去年の保育所利用の指数・ポイント（4さい）"] != null
                            ? item["去年の保育所利用の指数・ポイント（4さい）"]
                            : `-`}`,
                        color: "#000000",
                        align: "end",
                        wrap: true,
                        contents: [],
                    },
                ],
            }, {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "text",
                        text: "5歳児",
                        color: "#6A6A6A",
                        weight: "regular",
                        align: "start",
                        contents: [],
                    },
                    {
                        type: "text",
                        text: `${item["去年の保育所利用の倍率（5さい）"] != null
                            ? item["去年の保育所利用の倍率（5さい）"]
                            : "-"}／${item["去年の保育所利用の指数・ポイント（5さい）"] != null
                            ? item["去年の保育所利用の指数・ポイント（5さい）"]
                            : `-`}`,
                        color: "#000000",
                        align: "end",
                        wrap: true,
                        contents: [],
                    },
                ],
            });
        }
        carouselContents.push(content);
    }
    carouselContents.push({
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: `利用できる${systemsCount}個の${othersType}を見る`,
                    size: "lg",
                    color: "#1F00FFFF",
                    align: "center",
                    action: {
                        type: "uri",
                        label: "リンク",
                        uri: `${process.env.LIFF_URL}/others/${resultId}`,
                    },
                    contents: [],
                },
            ],
            justifyContent: "center",
        },
    });
    const returnMessage = {
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
//# sourceMappingURL=carousel.js.map