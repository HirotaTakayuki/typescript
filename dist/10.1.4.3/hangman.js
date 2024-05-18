"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("readline/promises"));
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
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
const rl = promises_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const CLI = {
    async input() {
        const input = await rl.question("文字または単語を推測してください: ");
        return input.replaceAll(" ", "").toLowerCase();
    },
    clear() {
        console.clear(); // コンソール画面のクリア
    },
    destroy() {
        rl.close(); // readlineインターフェイスの終了
    },
    output(message, color = "white") {
        console.log(chalk_1.default[color](message), "\n");
    },
    outputAnswer(message) {
        console.log(figlet_1.default.textSync(message, { font: "Big" }), "\n");
    },
};
// 確認
testQuestion();
// 確認用関数
async function testQuestion() {
    CLI.clear();
    const userInput = await CLI.input();
    CLI.output(userInput, "green");
    CLI.outputAnswer(userInput);
    CLI.destroy();
}
