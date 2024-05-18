"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const questions_test_json_1 = __importDefault(require("../data/questions.test.json"));
class Quiz {
    questions;
    constructor(questions) {
        this.questions = questions;
    }
    // 次の質問が存在するか確認
    hasNext() {
        return this.questions.length > 0;
    }
    // ランダムに質問を取得して、その質問をリストから削除
    getNext() {
        const idx = Math.floor(Math.random() * this.questions.length);
        const [question] = this.questions.splice(idx, 1);
        return question;
    }
    // 残りの質問数を取得
    lefts() {
        return this.questions.length;
    }
}
const questions = questions_test_json_1.default;
const quiz = new Quiz(questions);
// 確認
while (quiz.hasNext()) {
    console.log(quiz.getNext());
    console.log(quiz.hasNext());
    console.log(quiz.lefts());
}
