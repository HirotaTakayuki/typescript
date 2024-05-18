"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
class Quiz {
    questions;
    constructor(questions) {
        this.questions = questions;
    }
    hasNext() {
        return this.questions.length > 0;
    }
    getNext() {
        const idx = Math.floor(Math.random() * this.questions.length);
        const [question] = this.questions.splice(idx, 1);
        return question;
    }
    lefts() {
        return this.questions.length;
    }
}
exports.Quiz = Quiz;
