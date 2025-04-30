"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeError = void 0;
exports.checkForTypeErrors = checkForTypeErrors;
class TypeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TypeError'; // Custom name for our TypeError
    }
}
exports.TypeError = TypeError;
/**
 * Function to check for type errors based on token type.
 * @param tokens The array of tokens representing the current parsed expression
 */
function checkForTypeErrors(tokens) {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        // Example check: if we expect a number, but get a string
        if (token.type === 'Number' && typeof token.value !== 'number') {
            throw new TypeError(`Expected number but found ${typeof token.value} at token ${i}`);
        }
        if (token.type === 'String' && typeof token.value !== 'string') {
            throw new TypeError(`Expected string but found ${typeof token.value} at token ${i}`);
        }
        // Example check for an identifier being used incorrectly
        if (token.type === 'Identifier' && typeof token.value !== 'string') {
            throw new TypeError(`Expected identifier to be of type 'string' but found ${typeof token.value} at token ${i}`);
        }
        // Add more type checks as needed for different token types, e.g., Boolean, Operator
    }
}
