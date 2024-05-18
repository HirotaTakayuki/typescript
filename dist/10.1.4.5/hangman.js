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
class Stage {
    answer;
    leftAttempts = 5;
    question;
    constructor(question) {
        this.question = question;
        // answerにブランク "_" の羅列を設定
        this.answer = new Array(question.word.length).fill("_").join("");
    }
    // 試行回数を1減少
    decrementAttempts() {
        return --this.leftAttempts;
    }
    updateAnswer(userInput = "") {
        if (!userInput)
            return; // 空文字の場合、以降の処理は行わない
        const regex = new RegExp(userInput, "g"); // 入力を正規表現として使用
        const answerArry = this.answer.split(""); // 文字列を配列に変換
        let matches; // 正規表現での検索結果を格納する変数
        // 入力と一致する箇所がなくなるまで繰り返す。
        while ((matches = regex.exec(this.question.word))) {
            /**
             * "n" で "union" を検索した際の matches の例
             * 1ループ目：[ 'n', index: 1, input: 'union', groups: undefined ]
             * 2ループ目：[ 'n', index: 4, input: 'union', groups: undefined ]
             */
            const foundIdx = matches.index;
            // 対象のインデックスから、一致した箇所を入力された文字と置き換え
            answerArry.splice(foundIdx, userInput.length, ...userInput);
            this.answer = answerArry.join(""); // 配列を文字列に変換
        }
    }
    // 入力が単語の長さを超えているか判定
    isTooLong(userInput) {
        return userInput.length > this.question.word.length;
    }
    // 単語にユーザー入力が含まれるか判定
    isIncludes(userInput) {
        return this.question.word.includes(userInput);
    }
    // 解答が単語のすべての文字列と一致したか判定
    isCorrect() {
        return this.answer === this.question.word;
    }
    // 試行回数が0か判定
    isGameOver() {
        return this.leftAttempts === 0;
    }
}
class Message {
    ui; //
    constructor(ui) {
        this.ui = ui;
    }
    // 問題をユーザーに表示
    askQuestion(stage) {
        this.ui.output(`Hint: ${stage.question.hint}`, "yellow");
        this.ui.outputAnswer(stage.answer.replaceAll("", " ").trim());
        this.ui.output(`（残りの試行回数: ${stage.leftAttempts}）`);
    }
    leftQuestions(quiz) {
        this.ui.output(`残り${quiz.lefts() + 1}問`);
    }
    start() {
        this.ui.output("\nGame Start!!");
    }
    enterSomething() {
        this.ui.output(`何か文字を入力してください。`, "red");
    }
    notInclude(input) {
        this.ui.output(`"${input}" は単語に含まれていません。`, "red");
    }
    notCorrect(input) {
        this.ui.output(`残念！ "${input}" は正解ではありません。`, "red");
    }
    hit(input) {
        this.ui.output(`"${input}" が Hit!`, "green");
    }
    correct(question) {
        this.ui.output(`正解！ 単語は "${question.word}" でした。`, "green");
    }
    gameover(question) {
        this.ui.output(`正解は ${question.word} でした。`);
    }
    end() {
        this.ui.output("ゲーム終了です！お疲れ様でした！");
    }
}
const questions = questions_test_json_1.default;
// 確認用
const message = new Message(CLI);
testMessage();
async function testMessage() {
    message.start();
    message.end();
    CLI.destroy();
}
