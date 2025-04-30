"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxError = void 0;
exports.checkForSyntaxErrors = checkForSyntaxErrors;
class SyntaxError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SyntaxError'; // Custom name for our SyntaxError
    }
}
exports.SyntaxError = SyntaxError;
function checkForSyntaxErrors(tokens) {
    // Example: Check for a missing '+' between numbers
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'Number' && tokens[i + 1]?.type === 'Number') {
            throw new SyntaxError(`No operator between numbers at ${tokens[i].value} and ${tokens[i + 1].value}`);
        }
    }
}
