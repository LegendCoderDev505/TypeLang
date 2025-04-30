"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syntaxError_1 = require("./Errors/syntaxError");
function parseExpression(expression) {
    // Example of simple syntax check for consecutive numbers without an operator
    const regex = /\d+\s+\d+/g; // This regex will match two numbers with space in between (invalid case)
    if (regex.test(expression)) {
        throw new syntaxError_1.SyntaxError(`SyntaxError: No '+' at ${expression}`);
    }
    // Further parsing logic here...
}
function main() {
    const input = "10 10 + 10"; // This would trigger the syntax error
    try {
        parseExpression(input);
    }
    catch (err) {
        if (err instanceof syntaxError_1.SyntaxError) {
            console.error(err.message); // Display the custom error message
        }
        else {
            console.error("An unexpected error occurred.");
        }
    }
}
main();
