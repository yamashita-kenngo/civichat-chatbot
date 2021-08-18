import * as line from "@line/bot-sdk";
import * as types from "@line/bot-sdk/lib/types";

import {
  Answer,
  Question,
  ChatState,
  Session,
  System,
  Sessions,
  Qna,
  system,
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

const questionTemplate= require("./messages/question_m");

import jsonAnswers from "../../../datas/answers.json";
import jsonQuestions from "../../../datas/questions.json";
import systems from "../../../datas/systems.json";
import systemsData from "../../../datas/systemsdata.json";

const questions: Array<Question> = [];
let sessions: Sessions = {};

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
          // 初期ChatStateの生成
          const cs = new ChatState(systems["systems"], questions);
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
        } else {
          // ユーザーのセッション取得
          const userSession: Session = sessions[event.source.userId];
          console.log(userSession);
          if (userSession) {
            const cs = userSession.getState();
            cs.selectAnswerByText(
              userSession.getBeforeQuestionId(),
              event.message.text
            );
            cs.maintenanceQuestions();
            if (cs.isEnded()) {
              console.log("制度推薦終了");
              //カルーセルが9枚より上
              if (cs.getSystems().length > 9) {
                const results = cs.getSystems().map((system: string) => {
                  return systemsData["systemsData"].filter((systemD) => {
                    return systemD["PSID"] === system;
                  })[0];
                });
                console.log("##############################")
                console.log(cs.getSystems())
                console.log("##############################")
                const resultId = await db.queryServices(
                  cs.getSystems(),
                  event.source.userId
                );
                console.log(resultId)
                console.log("========================")
                returnMessage = await carouselTemplate(
                  results.slice(0, 9),
                  resultId
                );
              } else {
                // 9枚以下
                const results = cs.getSystems().map((system: string) => {
                  return systemsData["systemsData"].filter((systemD) => {
                    return systemD["PSID"] === system;
                  })[0];
                });
                const resultId = await db.queryServices(
                  cs.getSystems(),
                  event.source.userId
                );
                returnMessage = await carouselTemplate(results, resultId);
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
        text: "「制度を探す」と送信してください！",
      };
      break;
  }
  client.replyMessage(event.replyToken, returnMessage);
};
