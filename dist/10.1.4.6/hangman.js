"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 組み込みモジュール
const promises_1 = __importDefault(require("readline/promises"));
// サードパーティライブラリ
const chalk_1 = __importDefault(require("chalk")); // 文字色を変えるためのモジュール
const figlet_1 = __importDefault(require("figlet")); // 文字を大きく表示するためのモジュール
// 問題を格納するJSONファイルの読み込み
const questions_test_json_1 = __importDefault(require("../data/questions.test.json"));
/**
 * 質問の管理を行います。
 */
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
/**
 * 解答の状況を管理します。
 */
class Stage {
    answer; // 解答の状態（例：ty_escri_t）
    leftAttempts = 5; // 試行回数
    question; // 出題中の問題
    constructor(question) {
        this.question = question;
        // answerにブランク "_" の羅列を設定
        this.answer = new Array(question.word.length).fill("_").join("");
    }
    // 試行回数を1減少
    decrementAttempts() {
        return --this.leftAttempts;
    }
    /**
     * 正規表現を用いて入力文字との一致箇所を特定し、answerプロパティ(解答)を更新します。
     */
    updateAnswer(userInput = "") {
        if (!userInput)
            return; // 空文字の場合、以降の処理は行わない
        const regex = new RegExp(userInput, "g"); // 入力を正規表現のパターンとして使用
        const answerArry = this.answer.split(""); // 文字列を配列に変換
        let matches; // 正規表現での検索結果を格納する変数
        // ユーザーの入力と一致する箇所がなくなるまで繰り返す。
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
    // 解答が単語と完全に一致するか判定
    isCorrect() {
        return this.answer === this.question.word;
    }
    // 試行回数が0か判定
    isGameOver() {
        return this.leftAttempts === 0;
    }
}
/**
 * コマンドラインインターフェイスの制御を行います。
 */
const CLI = {
    async input() {
        const input = await rl.question("文字または単語を推測してください: ");
        return input.replaceAll(" ", "").toLowerCase();
    },
    clear() {
        console.clear();
    },
    destroy() {
        rl.close();
    },
    // ライブラリを使用して、色付きでメッセージを出力
    output(message, color = "white") {
        console.log(chalk_1.default[color](message), "\n");
    },
    // ライブラリを使用して、文字を大きく出力
    outputAnswer(message) {
        console.log(figlet_1.default.textSync(message, { font: "Big" }), "\n");
    },
};
/**
 * 画面上のメッセージを管理します。
 */
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
/**
 * ゲームの進行を制御します。
 */
class Game {
    quiz; // ゲーム内のクイズの情報管理を担当
    message; // ゲーム内のメッセージ管理を担当
    stage; // 現在のゲームステージの情報管理を担当
    ui; // ゲームのUIとのインタラクション機能を提供
    constructor(quiz, message, ui) {
        this.quiz = quiz;
        this.message = message;
        this.ui = ui;
        this.stage = new Stage(this.quiz.getNext()); // 初期ステージを設定する。
    }
    // ゲームが終了すべきかを判定する
    shouldEnd() {
        if (this.stage.isGameOver()) {
            return true;
        }
        // 最終問題かつ、正解した場合
        if (!this.quiz.hasNext() && this.stage.isCorrect()) {
            return true;
        }
        return false;
    }
    // 次のアクションを決定するGameStateを返す関数。完全一致させたときと、推測に間違えたときに呼び出す。
    next(isCorrect) {
        if (!isCorrect) {
            // 推論に間違えた場合
            this.stage.decrementAttempts();
        }
        if (this.shouldEnd()) {
            // ゲームを終了すると判断するとき
            return { stage: this.stage, done: true }; // ゲーム終了のためにdoneをtrueに設定する。
        }
        if (isCorrect) {
            // 推測が完全に一致した場合
            this.stage = new Stage(this.quiz.getNext()); // 次のstageの情報を設定
        }
        return { stage: this.stage, done: false }; // ゲームは終了しない。
    }
    // 内部でawaitを使用しているため、asyncで宣言
    async start() {
        this.ui.clear();
        this.message.start();
        // GameStateの初期値を設定
        let state = {
            stage: this.stage,
            done: false,
        };
        // ゲームオーバーになるか、全ての問題を正解するまでループ
        while (!state.done) {
            if (state.stage === undefined)
                break;
            const { stage } = state;
            this.message.leftQuestions(this.quiz); // 残り何問か表示
            this.message.askQuestion(stage);
            // ユーザーの入力を待機
            const userInput = await this.ui.input();
            // 入力値チェック
            if (!userInput) {
                // 入力がない旨のメッセージを表示
                this.message.enterSomething();
                // 不正解として扱い、falseを渡してnextを呼び出し、GameStateを更新
                state = this.next(false);
                continue; // 以降の処理を中断し、次のループ処理を実行
            }
            // 解答状況を最新の状態に更新
            stage.updateAnswer(userInput);
            // 入力が正解と完全一致するか判定
            if (stage.isCorrect()) {
                this.message.correct(stage.question); // 完全に正解した旨を表示
                state = this.next(true); // 正解したため、trueを渡してnextを呼び出す
                continue;
            }
            // 入力の文字数が正解より長いか判定
            if (stage.isTooLong(userInput)) {
                this.message.notCorrect(userInput);
                // 不正解のため、falseを渡してnextを呼び出す
                state = this.next(false);
                continue;
            }
            // 入力が部分的に正解に一致するか判定
            if (stage.isIncludes(userInput)) {
                this.message.hit(userInput);
                continue;
            }
            // 入力がどの文字にも一致しない場合
            this.message.notInclude(userInput);
            state = this.next(false);
        }
        // 試行回数が0か判定
        if (state.stage.isGameOver()) {
            this.message.gameover(this.stage.question);
        }
        this.message.end();
        this.ui.destroy();
    }
}
// 問題の読み込み
const questions = questions_test_json_1.default;
// 入出力機能を提供するオブジェクトを生成
const rl = promises_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// クラスの初期化
const quiz = new Quiz(questions);
const message = new Message(CLI);
const game = new Game(quiz, message, CLI);
// ゲーム開始
game.start();
