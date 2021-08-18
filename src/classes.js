"use strict";
exports.__esModule = true;
exports.Answer = exports.Session = exports.ChatState = exports.Question = void 0;
var Answer = /** @class */ (function () {
    function Answer(id, answerText, qnaMap, callback) {
        this.id = id;
        this.answerText = answerText;
        this.qnaMap = qnaMap;
        this.callback = callback;
    }
    Answer.prototype.isMatch = function (system) {
        return this.qnaMap[system] ? true : false;
    };
    Answer.prototype.getAnswerText = function () {
        return this.answerText;
    };
    return Answer;
}());
exports.Answer = Answer;
var Question = /** @class */ (function () {
    function Question(id, questionText, answers) {
        this.id = id;
        this.questionText = questionText;
        this.answers = answers;
    }
    Question.prototype.getQuestionText = function () {
        return this.questionText;
    };
    return Question;
}());
exports.Question = Question;
var ChatState = /** @class */ (function () {
    function ChatState(systems, questions) {
        this.systems = systems;
        this.questions = questions;
    }
    ChatState.prototype.getSystems = function () {
        return this.systems;
    };
    ChatState.prototype.getQuestions = function () {
        return this.questions;
    };
    ChatState.prototype.selectAnswerById = function (questionId, answerId) {
        var _this = this;
        this.questions
            .filter(function (question) {
            return question.id === questionId;
        })
            .forEach(function (question) {
            question.answers
                .filter(function (answer) {
                return answer.id === answerId;
            })
                .forEach(function (answer) {
                _this.systems = _this.systems.filter(function (system) {
                    return answer.isMatch(system);
                });
                _this.questions = _this.questions.filter(function (question) {
                    return question.id != questionId;
                });
            });
        });
    };
    ChatState.prototype.selectAnswerByText = function (questionId, answerText) {
        var _this = this;
        this.questions
            .filter(function (question) {
            return question.id === questionId;
        })
            .forEach(function (question) {
            question.answers
                .filter(function (answer) {
                return answer.answerText === answerText;
            })
                .forEach(function (answer) {
                _this.systems = _this.systems.filter(function (system) {
                    return answer.isMatch(system);
                });
                _this.questions = _this.questions.filter(function (question) {
                    return question.id != questionId;
                });
            });
        });
    };
    ChatState.prototype.maintenanceQuestions = function () {
        var _this = this;
        console.log(this.questions);
        this.questions = this.questions
            .map(function (question) {
            var trues = 0;
            question.answers.forEach(function (answer) {
                _this.systems.forEach(function (system) {
                    trues += answer.qnaMap[system] ? 1 : 0;
                });
            });
            if (trues < _this.systems.length * question.answers.length &&
                trues != 0) {
                return question;
            }
        })
            .filter(function (v) { return v; });
    };
    ChatState.prototype.selectQuestionFromPriority = function () {
        return this.questions[0];
    };
    ChatState.prototype.isEnded = function () {
        return this.questions.length === 0 || this.systems.length === 0;
    };
    ChatState.prototype.questionMessageItem = function () {
        return {
            questionText: this.selectQuestionFromPriority().questionText,
            answers: this.selectQuestionFromPriority().answers.map(function (answer) {
                return {
                    answerText: answer.answerText,
                    callback: answer.answerText
                };
            })
        };
    };
    return ChatState;
}());
exports.ChatState = ChatState;
var Session = /** @class */ (function () {
    function Session(state, beforeQuestionId) {
        this.state = state;
        this.beforeQuestionId = beforeQuestionId;
    }
    Session.prototype.getState = function () {
        return this.state;
    };
    Session.prototype.getBeforeQuestionId = function () {
        return this.beforeQuestionId;
    };
    return Session;
}());
exports.Session = Session;
