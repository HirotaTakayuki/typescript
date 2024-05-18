"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Stage_1 = require("./Stage");
class Game {
    quiz;
    message;
    stage;
    ui;
    constructor(quiz, message, ui) {
        this.quiz = quiz;
        this.message = message;
        this.ui = ui;
        this.stage = new Stage_1.Stage(this.quiz.getNext());
    }
    shouldEnd() {
        if (this.stage.isGameOver()) {
            return true;
        }
        if (!this.quiz.hasNext() && this.stage.isCorrect()) {
            return true;
        }
        return false;
    }
    next(isCorrect) {
        if (!isCorrect) {
            this.stage.decrementAttempts();
        }
        if (this.shouldEnd()) {
            return { stage: this.stage, done: true };
        }
        if (isCorrect) {
            this.stage = new Stage_1.Stage(this.quiz.getNext());
        }
        return { stage: this.stage, done: false };
    }
    async start() {
        this.ui.clear();
        this.message.start();
        let state = {
            stage: this.stage,
            done: false,
        };
        while (!state.done) {
            if (state.stage === undefined)
                break;
            const { stage } = state;
            this.message.leftQuestions(this.quiz);
            this.message.askQuestion(stage);
            const userInput = await this.ui.input();
            if (!userInput) {
                this.message.enterSomething();
                state = this.next(false);
                continue;
            }
            stage.updateAnswer(userInput);
            if (stage.isCorrect()) {
                this.message.correct(stage.question);
                state = this.next(true);
                continue;
            }
            if (stage.isTooLong(userInput)) {
                this.message.notCorrect(userInput);
                state = this.next(false);
                continue;
            }
            if (stage.isIncludes(userInput)) {
                this.message.hit(userInput);
                continue;
            }
            this.message.notInclude(userInput);
            state = this.next(false);
        }
        if (state.stage.isGameOver()) {
            this.message.gameover(this.stage.question);
        }
        this.message.end();
        this.ui.destroy();
    }
}
exports.Game = Game;
