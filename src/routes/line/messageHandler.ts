import * as line from "@line/bot-sdk";
import * as types from "@line/bot-sdk/lib/types";

import {
  Answer,
  Question,
  ChatState,
  Session,
  Sessions,
  Qna,
  answer,
  syst,
} from "../../classes";

const db = require("../../../db/index.js");

const config: line.ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);

const carouselTemplate = require("./messages/carousel");

const questionTemplate = require("./messages/question_m");

let sessions: Sessions = {};

module.exports = async (event: line.ReplyableEvent & line.WebhookEvent) => {
  console.log(event);
  if (!event.source.userId) {
    throw Error("userId is undefined");
  }
  let returnMessage: Array<types.Message> = [
    { type: "text", text: "hello world!" },
  ];

  switch (event.type) {
    case "message":
      if (event.message.type === "text") {
        if (event.message.text === "Civichatをはじめる") {
          returnMessage = [
            {
              type: "flex",
              altText: "選択してください",
              contents: {
                type: "bubble",
                direction: "ltr",
                header: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "どのCivichatを始めますか？",
                      weight: "bold",
                      align: "center",
                      contents: [],
                    },
                  ],
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "熊本県・震災制度",
                        data: "start-kumamoto_earthquake",
                      },
                      style: "primary",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "渋谷区・子育て制度",
                        data: "start-shibuya_parenting",
                      },
                      style: "primary",
                    },
                    {
                      type: "button",
                      action: {
                        type: "postback",
                        label: "渋谷区・保育施設",
                        data: "start-shibuya_preschool",
                      },
                      style: "primary",
                    },
                  ],
                },
              },
            },
          ];
        } else {
          // ユーザーのセッション取得
          const userSession: Session = sessions[event.source.userId];
          let systemsData;
          if (userSession) {
            const cs = userSession.getState();
            if (cs.getSeido() === "kumamoto_earthquake") {
              systemsData = require("../../../datas/kumamotoEarthquake/systemsdata.json");
            } else if (cs.getSeido() === "shibuya_parenting") {
              systemsData = require("../../../datas/shibuyaParenting/systemsdata.json");
            } else if (cs.getSeido() === "shibuya_preschool") {
              systemsData = require("../../../datas/shibuyaPreschool/systemsdata.json");
            }
            cs.selectAnswerByText(
              userSession.getBeforeQuestionId(),
              event.message.text
            );
            cs.maintenanceQuestions();
            if (cs.isEnded()) {
              console.log(`制度推薦終了,${cs.getSystems().length}個の制度`);
              if (cs.getSystems().length === 0) {
                returnMessage = [
                  {
                    type: "text",
                    text: "現在の条件では、該当するものを見つけることができませんでした。再度、条件を変更してお試しください。",
                  },
                ];
              }
              //カルーセルが9枚より上
              else if (cs.getSystems().length > 9) {
                const results = cs.getSystems().map((system: string) => {
                  return systemsData["systemsData"].filter((systemD) => {
                    return systemD["サービスID"] === system;
                  })[0];
                });
                const systemsCount = results.length;
                const [resultId, othersType, imgUrl] = await db.queryServices(
                  cs.getSystems(),
                  event.source.userId,
                  cs.getSeido()
                );
                returnMessage = [
                  {
                    type: "text",
                    text: `質問へのご回答ありがとうございました！\nあなたの条件にぴったりの${othersType}が${results.length}件見つかりました！\n\n（最新情報は各公式ホームページをご確認ください。もし間違いなどございましたら、運営までご連絡ください。）`,
                  },
                  await carouselTemplate(
                    results.slice(0, 9),
                    systemsCount,
                    resultId,
                    othersType,
                    imgUrl
                  ),
                ];
              } else {
                // 9枚以下
                const results = cs.getSystems().map((system: string) => {
                  return systemsData["systemsData"].filter((systemD) => {
                    return systemD["サービスID"] === system;
                  })[0];
                });
                const systemsCount = results.length;
                const [resultId, othersType, imgUrl] = await db.queryServices(
                  cs.getSystems(),
                  event.source.userId,
                  cs.getSeido()
                );
                returnMessage = [
                  {
                    type: "text",
                    text: `質問へのご回答ありがとうございました！\nあなたの条件にぴったりの${othersType}が${results.length}件見つかりました！\n\n（最新情報は各公式ホームページをご確認ください。もし間違いなどございましたら、運営までご連絡ください。）`,
                  },
                  await carouselTemplate(
                    results,
                    systemsCount,
                    resultId,
                    othersType,
                    imgUrl
                  ),
                ];
              }
            } else {
              sessions = {
                ...sessions,
                [event.source.userId]: new Session(
                  cs,
                  cs.selectQuestionFromPriority().id
                ),
              };
              returnMessage = [
                await questionTemplate(cs.questionMessageItem()),
              ];
            }
          } else {
            returnMessage = [
              {
                type: "text",
                text: "不明なエラーが発生しました。「制度を探す」と送信してもう一度お試しください。",
              },
            ];
          }
        }
      } else {
        returnMessage = [
          {
            type: "text",
            text: "「制度を探す」と送信してください！",
          },
        ];
      }
      break;
    case "follow":
      returnMessage = [
        {
          type: "text",
          text: "友だち登録ありがとうございます！\n\n「Civichat（シビチャット）」はあなたにぴったりの行政サービスをかんたんに探せるサービスです 🤳🏛　\n\n現在は渋谷区の子育て系の制度・保育施設に加え、熊本市の災害支援制度を探すことができます📱\n\n※スマホ版LINEアプリのみの対応となります。（パソコンからのご利用はできません。）\n※質問への回答を修正したい場合は、初めからやり直してください。",
        },
      ];
      break;
    case "postback":
      if (
        event.postback.data === "start-kumamoto_earthquake" ||
        event.postback.data === "start-shibuya_preschool" ||
        event.postback.data === "start-shibuya_parenting"
      ) {
        const selected = event.postback.data.split("-")[1];

        // 上でやってた初期化をここでやる
        let jsonAnswers, jsonQuestions, systems;
        if (selected === "kumamoto_earthquake") {
          jsonAnswers = require(`../../../datas/kumamotoEarthquake/answers.json`);
          jsonQuestions = require(`../../../datas/kumamotoEarthquake/questions.json`);
          systems = require(`../../../datas/kumamotoEarthquake/systems.json`);
        } else if (selected === "shibuya_parenting") {
          jsonAnswers = require(`../../../datas/shibuyaParenting/answers.json`);
          jsonQuestions = require(`../../../datas/shibuyaParenting/questions.json`);
          systems = require(`../../../datas/shibuyaParenting/systems.json`);
        } else if (selected === "shibuya_preschool") {
          jsonAnswers = require(`../../../datas/shibuyaPreschool/answers.json`);
          jsonQuestions = require(`../../../datas/shibuyaPreschool/questions.json`);
          systems = require(`../../../datas/shibuyaPreschool/systems.json`);
        }
        const questions: Array<Question> = [];

        jsonAnswers["qnas"].forEach((question: Qna, i: number) => {
          const answers: Array<Answer> = [];
          question.answers.forEach((answer: answer, j: number) => {
            let syst: syst = {};

            systems["systems"].forEach((system: string, k: number) => {
              syst = {
                ...syst,
                [system]: answer.systems[k].system_answer === "1",
              };
            });

            answers.push(
              new Answer(
                jsonQuestions.questions[i].answers[j].answer_id,
                jsonQuestions.questions[i].answers[j].answer_text,
                syst
              )
            );
          });
          questions.push(
            new Question(
              jsonQuestions.questions[i].question_id,
              jsonQuestions.questions[i].question_text,
              answers
            )
          );
        });

        // 初期ChatStateの生成
        const cs = new ChatState(systems["systems"], questions, selected);
        // Sessionに前回のデータが残ってたら除去
        if (sessions[event.source.userId]) {
          delete sessions[event.source.userId];
        }
        sessions = {
          ...sessions,
          [event.source.userId]: new Session(
            cs,
            cs.selectQuestionFromPriority().id
          ),
        };
        returnMessage = [await questionTemplate(cs.questionMessageItem())];
      }
      break;
  }
  client.replyMessage(event.replyToken, returnMessage);
};
