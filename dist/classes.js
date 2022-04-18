"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = exports.Session = exports.ChatState = exports.Question = void 0;
class Answer {
    constructor(id, answerText, qnaMap, callback) {
        this.id = id;
        this.answerText = answerText;
        this.qnaMap = qnaMap;
        this.callback = callback;
    }
    isMatch(system) {
        return this.qnaMap[system] ? true : false;
    }
    getAnswerText() {
        return this.answerText;
    }
}
exports.Answer = Answer;
class Question {
    constructor(id, questionText, answers) {
        this.id = id;
        this.questionText = questionText;
        this.answers = answers;
    }
    getQuestionText() {
        return this.questionText;
    }
}
exports.Question = Question;
class ChatState {
    constructor(systems, questions, seido) {
        this.systems = systems;
        this.questions = questions;
        this.seido = seido;
    }
    getSeido() {
        return this.seido;
    }
    getSystems() {
        return this.systems;
    }
    getQuestions() {
        return this.questions;
    }
    selectAnswerById(questionId, answerId) {
        this.questions
            .filter((question) => {
            return question.id === questionId;
        })
            .forEach((question) => {
            question.answers
                .filter((answer) => {
                return answer.id === answerId;
            })
                .forEach((answer) => {
                this.systems = this.systems.filter((system) => {
                    return answer.isMatch(system);
                });
                this.questions = this.questions.filter((question) => {
                    return question.id != questionId;
                });
            });
        });
    }
    selectAnswerByText(questionId, answerText) {
        this.questions
            .filter((question) => {
            return question.id === questionId;
        })
            .forEach((question) => {
            question.answers
                .filter((answer) => {
                return answer.answerText === answerText;
            })
                .forEach((answer) => {
                this.systems = this.systems.filter((system) => {
                    return answer.isMatch(system);
                });
                this.questions = this.questions.filter((question) => {
                    return question.id != questionId;
                });
            });
        });
    }
    maintenanceQuestions() {
        this.questions = this.questions
            .map((question) => {
            let trues = 0;
            question.answers.forEach((answer) => {
                this.systems.forEach((system) => {
                    trues += answer.qnaMap[system] ? 1 : 0;
                });
            });
            if (trues < this.systems.length * question.answers.length &&
                trues != 0) {
                return question;
            }
        })
            .filter((v) => v);
    }
    selectQuestionFromPriority() {
        return this.questions[0];
    }
    isEnded() {
        return this.questions.length === 0 || this.systems.length === 0;
    }
    questionMessageItem() {
        return {
            questionText: this.selectQuestionFromPriority().questionText,
            answers: this.selectQuestionFromPriority().answers.map((answer) => {
                let trues = 0;
                this.systems.forEach((system) => {
                    trues += answer.qnaMap[system] ? 1 : 0;
                });
                return {
                    answerText: `${answer.answerText}（該当${String(trues)}件）`,
                    callback: answer.answerText,
                };
            }),
        };
    }
}
exports.ChatState = ChatState;
class Session {
    constructor(state, beforeQuestionId) {
        this.state = state;
        this.beforeQuestionId = beforeQuestionId;
    }
    getState() {
        return this.state;
    }
    getBeforeQuestionId() {
        return this.beforeQuestionId;
    }
}
exports.Session = Session;
//# sourceMappingURL=classes.js.map