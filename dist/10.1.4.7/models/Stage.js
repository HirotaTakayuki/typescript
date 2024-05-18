"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stage = void 0;
class Stage {
    answer;
    leftAttempts = 5;
    question;
    constructor(question) {
        this.question = question;
        this.answer = new Array(question.word.length).fill("_").join("");
    }
    decrementAttempts() {
        return --this.leftAttempts;
    }
    updateAnswer(userInput = "") {
        if (!userInput)
            return;
        const regex = new RegExp(userInput, "g");
        const answerArry = this.answer.split("");
        let matches;
        while ((matches = regex.exec(this.question.word))) {
            const foundIdx = matches.index;
            answerArry.splice(foundIdx, userInput.length, ...userInput);
            this.answer = answerArry.join("");
        }
    }
    isTooLong(userInput) {
        return userInput.length > this.question.word.length;
    }
    isIncludes(userInput) {
        return this.question.word.includes(userInput);
    }
    isCorrect() {
        return this.answer === this.question.word;
    }
    isGameOver() {
        return this.leftAttempts === 0;
    }
}
exports.Stage = Stage;
