"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const promises_1 = __importDefault(require("readline/promises"));
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const rl = promises_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
exports.CLI = {
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
    output(message, color = "white") {
        console.log(chalk_1.default[color](message), "\n");
    },
    outputAnswer(message) {
        console.log(figlet_1.default.textSync(message, { font: "Big" }), "\n");
    },
};
