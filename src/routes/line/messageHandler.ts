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
  let returnMessage: types.Message = { type: "text", text: "hello world!" };

  switch (event.type) {
    case "message":
      if (event.message.type === "text") {
        if (event.message.text === "制度を探す") {
          returnMessage = {
            type: "flex",
            altText: "どの制度を探しますか？",
            contents: {
              type: "bubble",
              direction: "ltr",
              header: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "どの制度を探しますか？",
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
                      label: "熊本震災Ver.",
                      data: "start-kumamoto",
                    },
                    style: "primary",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "渋谷子育てVer.",
                      data: "start-shibuya",
                    },
                    style: "primary",
                  },
                  {
                    type: "button",
                    action: {
                      type: "postback",
                      label: "渋谷幼稚・保育園Ver.",
                      data: "start-shibuyaKindergarten",
                    },
                    style: "primary",
                  },
                ],
              },
            },
          };
        } else {
          // ユーザーのセッション取得
          const userSession: Session = sessions[event.source.userId];
          let systemsData;
          if (userSession) {
            const cs = userSession.getState();
            if (cs.getSeido() === "kumamoto") {
              systemsData = require(`../../../datas/kumamoto/systemsdata.json`);
            } else if (cs.getSeido() === "shibuya") {
              systemsData = require(`../../../datas/shibuya/systemsdata.json`);
            }else if (cs.getSeido() === "shibuyaKindergarten") {
              systemsData = require(`../../../datas/shibuyaKindergarten/systemsdata.json`);
            }
            cs.selectAnswerByText(
              userSession.getBeforeQuestionId(),
              event.message.text
            );
            cs.maintenanceQuestions();
            if (cs.isEnded()) {
              console.log(`制度推薦終了,${cs.getSystems().length}個の制度`);
              //カルーセルが9枚より上
              if (cs.getSystems().length > 9) {
                const results = cs.getSystems().map((system: string) => {
                  return systemsData["systemsData"].filter((systemD) => {
                    return systemD["PSID"] === system;
                  })[0];
                });
                const systemsCount = results.length;
                const resultId = await db.queryServices(
                  cs.getSystems(),
                  event.source.userId,
                  cs.getSeido()
                );
                returnMessage = await carouselTemplate(
                  results.slice(0, 9),
                  systemsCount,
                  resultId
                );
              } else {
                // 9枚以下
                const results = cs.getSystems().map((system: string) => {
                  return systemsData["systemsData"].filter((systemD) => {
                    return systemD["PSID"] === system;
                  })[0];
                });
                const systemsCount = results.length;
                const resultId = await db.queryServices(
                  cs.getSystems(),
                  event.source.userId,
                  cs.getSeido()
                );
                returnMessage = await carouselTemplate(
                  results,
                  systemsCount,
                  resultId
                );
              }
            } else {
              sessions = {
                ...sessions,
                [event.source.userId]: new Session(
                  cs,
                  cs.selectQuestionFromPriority().id
                ),
              };
              returnMessage = await questionTemplate(cs.questionMessageItem());
            }
          } else {
            returnMessage = {
              type: "text",
              text: "不明なエラーが発生しました。「制度を探す」と送信してもう一度お試しください。",
            };
          }
        }
      } else {
        returnMessage = {
          type: "text",
          text: "「制度を探す」と送信してください！",
        };
      }
      break;
    case "follow":
      returnMessage = {
        type: "text",
        text: "お友だち登録ありがとうございます！\n「制度を探す」と送信してみなさんにぴったりの制度を見つけてください！\n ━━━━━━━━━━━━ \n 現在は「渋谷区に在住」していて「20歳未満の子どもを養育している方」に向けて制度と、「熊本震災で使える制度情報」のおすすめをしています\n（他の市区町村に在住の方と熊本震災で被災されていない方はもうしばらくお待ちください...） \n ━━━━━━━━━━━━ \n このアカウントは「株式会社Civichat」が運営しています。 \n  https://civichat.jp/ \n LINE（株）が提供、または新たに取得される情報の取り扱いについては以下をご確認ください。 \n https://terms.line.me/OA_privacy?lang=ja",
      };
      break;
    case "postback":
      if (
        event.postback.data === "start-kumamoto" ||
        event.postback.data === "start-shibuya" ||
        event.postback.data === "start-shibuyaKindergarten" 
      ) {
        const selected = event.postback.data.split("-")[1];

        // 上でやってた初期化をここでやる
        let jsonAnswers, jsonQuestions, systems;
        if (selected === "kumamoto") {
          jsonAnswers = require(`../../../datas/kumamoto/answers.json`);
          jsonQuestions = require(`../../../datas/kumamoto/questions.json`);
          systems = require(`../../../datas/kumamoto/systems.json`);
        } else if (selected === "shibuya") {
          jsonAnswers = require(`../../../datas/shibuya/answers.json`);
          jsonQuestions = require(`../../../datas/shibuya/questions.json`);
          systems = require(`../../../datas/shibuya/systems.json`);
        } else if (selected === "shibuyaKindergarten") {
          jsonAnswers = require(`../../../datas/shibuyaKindergarten/answers.json`);
          jsonQuestions = require(`../../../datas/shibuyaKindergarten/questions.json`);
          systems = require(`../../../datas/shibuyaKindergarten/systems.json`);
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
        returnMessage = await questionTemplate(cs.questionMessageItem());
      }
      break;
  }
  client.replyMessage(event.replyToken, returnMessage);
};
