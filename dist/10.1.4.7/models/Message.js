"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    ui;
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
exports.Message = Message;
